import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Art } from '../art/entities/art.entity';
import { History } from '../history/entities/history.entity';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentServie {
  constructor(private readonly connection: Connection) {}
  async create({ amount, artId }, currentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // 현재 결제 요청 유저 정보 조회
      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );

      const art = await queryRunner.manager.findOne(Art, { id: artId });

      // 낙찰 테이블 저장
      const payment = await queryRunner.manager.save(Payment, {
        amount: amount,
        user: user,
        art: art,
      });

      // 히스토리 테이블 저장
      await queryRunner.manager.save(History, {
        point: amount,
        user: user,
        payment: payment,
      });

      // 유저 누적 포인트 업데이트
      await queryRunner.manager.save(User, {
        ...user,
        point: user.point - amount,
      });

      await queryRunner.commitTransaction();
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'create';
    } finally {
      await queryRunner.release();
    }
  }
}
