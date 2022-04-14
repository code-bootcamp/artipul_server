import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Connection, LessThan, Repository } from 'typeorm';
import { Art } from '../art/entities/art.entity';
import { Engage } from '../engage/entities/engage.entity';
import { EventGateway } from '../event/event.gateway';
import { History } from '../history/entities/history.entity';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Art)
    private readonly artRepository: Repository<Art>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Engage)
    private readonly engageRepository: Repository<Engage>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private eventGateway: EventGateway,

    private readonly connection: Connection,
  ) {}

  async find() {
    await this.artRepository.find();
  }

  // 마감된 작품 체크
  async checkTimeout() {
    const utc = new Date();
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const currentTime = new Date(Number(utc) + Number(KR_TIME_DIFF));
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
      const updatedUser = await queryRunner.manager.save(User, {
        ...bidder,
        point: bidder.point - price,
      });

      // 히스토리 테이블(낙찰자) 저장
      await queryRunner.manager.save(History, {
        point: price,
        balance: updatedUser.point,
        user: updatedUser,
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

  // 레디스에 입찰 정보 저장(작품, 현재 입찰가, 현재 상위 입찰자)
  async call(artId, bid_price, email) {
    const art = await this.artRepository.findOne(artId);
    const utc = new Date();
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const currentTime = new Date(Number(utc) + Number(KR_TIME_DIFF));
    const time = Number(art.deadline) - Number(currentTime);
    if (time > 0) {
      await this.cacheManager.set(artId, [bid_price, email], {
        ttl: time + 65000,
      });
    }
    return [bid_price, email];
  }

  // 실시간 가격 변동, DB 저장
  async save(artId, userId, bid_price) {
    this.eventGateway.server.emit('message', {
      price: bid_price,
      artId: artId,
    });
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
      await queryRunner.manager.update(
        Art,
        { id: artId },
        { price: bid_price },
      );
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

  // 경매 참여 중인 작품 조회
  async findEngage(userId, page) {
    return await this.engageRepository.find({
      take: 10,
      skip: 10 * (page - 1),
      where: { userId: userId },
    });
  }

  async room(artId) {}
}
