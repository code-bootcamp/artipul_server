import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import {
  PointTransaction,
  POINTTRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';

@Injectable()
export class PointTransactionServive {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  // 현재 로그인한 유저가 포인트 내역 조회
  async findOne({ pointTransactionId }) {
    return await this.pointTransactionRepository.findOne({
      where: {
        id: pointTransactionId,
      },
    });
  }

  // 현재 로그인한 유저의 모든 포인트 내역 조회
  async findAll(userId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.find(PointTransaction, {
        user: userId,
      });
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.manager.release();
    }
  }

  // 포인트 충전 API
  async create({
    impUid,
    charge_amount,
    currentUser,
    status = POINTTRANSACTION_STATUS_ENUM.PAYMENT,
  }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // pointTransaction 테이블에 거래기록 생성
      const pointTransaction = this.pointTransactionRepository.create({
        impUid: impUid,
        charge_amount: charge_amount,
        user: currentUser,
        status,
      });
      await queryRunner.manager.save(pointTransaction);

      // 현재 결제 요청 유저 정보 조회
      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );

      // 유저 누적 포인트 업데이트
      const updatedUser = this.userRepository.create({
        ...user,
        point: user.point + charge_amount,
      });

      await queryRunner.manager.save(updatedUser);
      await queryRunner.commitTransaction();

      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'create';
    } finally {
      await queryRunner.release();
    }
  }

  // 중복 결제 확인 API
  async checkDuplicate({ impUid }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const result = await queryRunner.manager.findOne(
        PointTransaction,
        { impUid },
        { lock: { mode: 'pessimistic_write' } },
      );
      if (result) {
        throw new ConflictException('이미 결제 완료된 건입니다.');
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'checkDuplicate';
    } finally {
      await queryRunner.release();
    }
  }

  // 중복 취소 확인 API
  async checkAlreadyCanceled({ impUid }) {
    const pointTransaction = await this.pointTransactionRepository.findOne({
      impUid,
      status: POINTTRANSACTION_STATUS_ENUM.CANCLE,
    });

    if (pointTransaction) throw new ConflictException('이미 취소된 건입니다.');
  }

  // 취소하기에 충분한 나의 누적 포인트인지 확인 API
  async checkHasCancellablePoint({ impUid, currentUser }) {
    const userId = currentUser.id;
    const pointTransaction = await this.pointTransactionRepository.findOne({
      impUid,
      user: userId,
      status: POINTTRANSACTION_STATUS_ENUM.PAYMENT,
    });
    // console.log(pointTransaction);
    if (!pointTransaction)
      throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');

    const user = await this.userRepository.findOne({ id: currentUser.id });
    if (user.point < pointTransaction.charge_amount)
      throw new UnprocessableEntityException(
        '취소 가능한 포인트가 부족합니다.',
      );
  }

  // 포인트 충전 취소 API
  async cancel({ impUid, charge_amount, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const pointTransaction = await this.create({
        impUid,
        charge_amount: -charge_amount,
        currentUser,
        status: POINTTRANSACTION_STATUS_ENUM.CANCLE,
      });
      await queryRunner.manager.save(pointTransaction);
      await queryRunner.commitTransaction();

      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'cancel';
    } finally {
      await queryRunner.release();
    }
  }
}
