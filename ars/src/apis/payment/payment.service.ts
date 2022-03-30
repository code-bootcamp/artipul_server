import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Connection, LessThan, Repository } from 'typeorm';
import { Art } from '../art/entities/art.entity';
import { Engage } from '../engage/entities/engage.entity';
import { History } from '../history/entities/history.entity';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentServie {
  constructor(
    @InjectRepository(Art)
    private readonly artRepository: Repository<Art>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Engage)
    private readonly engageRepository: Repository<Engage>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly connection: Connection,
  ) {}

  // 마감된 작품 체크
  async checkTimeout() {
    const time = new Date();
    const yyyy = time.getFullYear();
    const mm = time.getMonth() + 1;
    const dd = time.getDate();
    const currentTime = `${yyyy}-${mm}-${dd}`;

    console.log(currentTime, ' 현 재 시 간 ');
    return await this.artRepository.find({
      where: {
        deadline: LessThan(currentTime),
      },
    });
  }

  // 낙찰
  async successfulBid(artId, price, bidder, artist) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const art = await queryRunner.manager.findOne(Art, { id: artId });

      // 작품 정보 수정 및 softDelete
      const soldoutArt = await queryRunner.manager.save(Art, {
        ...art,
        price: price,
        is_soldout: true,
      });
      await queryRunner.manager.softDelete(Art, { id: artId });
      await queryRunner.manager.delete(Engage, { art: artId });

      // 낙찰 테이블 저장
      const payment = await queryRunner.manager.save(Payment, {
        amount: price,
        user: bidder,
        art: soldoutArt,
      });

      // 유저 누적 포인트 업데이트
      const updated = await queryRunner.manager.save(User, {
        ...bidder,
        point: bidder.point - price,
      });

      // 히스토리 테이블(낙찰자) 저장
      await queryRunner.manager.save(History, {
        point: price,
        balance: updated.point,
        user: updated,
        payment: payment,
      });

      // 작가 누적 포인트 업데이트
      await queryRunner.manager.save(User, {
        ...artist,
        point: artist.point + price,
      });

      await queryRunner.commitTransaction();
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'successfulBid';
    } finally {
      await queryRunner.release();
    }
  }

  // 유찰
  async failedBid(artId) {
    await this.artRepository.softDelete({ id: artId });
  }

  // 입찰
  async call(artId, bid_price, email) {
    const art = await this.artRepository.findOne(artId);
    const time = Number(art.deadline) - Number(new Date());
    if (time > 0) {
      await this.cacheManager.set(artId, [bid_price, email], {
        ttl: time + 60000,
      });
    }
    return [bid_price, email];
  }

  async save(artId, userId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const prevEngage = await queryRunner.manager.findOne(Engage, {
        where: {
          userId: userId,
          art: artId,
        },
      });

      if (!prevEngage)
        await queryRunner.manager.save(Engage, {
          userId: userId,
          art: artId,
        });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'saveBid';
    } finally {
      await queryRunner.release();
    }
  }

  // 구매한 작품 목록 조회
  async find(userId) {
    return await this.paymentRepository.find({ user: userId });
  }

  // 경매 참여 중인 작품 조회
  async findEngage(userId) {
    return await this.engageRepository.find({ userId: userId });
  }
}
