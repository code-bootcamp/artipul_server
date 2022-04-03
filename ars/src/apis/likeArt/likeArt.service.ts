import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository } from 'typeorm';
import { Art } from '../art/entities/art.entity';
import { LikeArt } from '../art/entities/likeArt.entity';

@Injectable()
export class LikeArtService {
  constructor(
    @InjectRepository(LikeArt)
    private readonly likeArtRepository: Repository<LikeArt>,

    private readonly connection: Connection,
  ) {}

  async find(userId, page) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let arts = [];
      if (page) {
        arts = await queryRunner.manager.find(Art, {
          take: 10,
          skip: 10 * (page - 1),
          where: { userId: userId },
        });
      } else {
        arts = await queryRunner.manager.find(LikeArt, {
          where: { userId },
          relations: ['art'],
        });
      }
      return arts.map((ele) => ele.art);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'like art!!!';
    } finally {
      await queryRunner.release();
    }
  }

  async like(artId, userId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const art = await queryRunner.manager.findOne(Art, { id: artId });
      const prevLike = await queryRunner.manager.findOne(LikeArt, {
        where: {
          userId: userId,
          art: artId,
        },
      });
      if (!prevLike) {
        await queryRunner.manager.save(LikeArt, {
          userId: userId,
          art: art,
        });
        await queryRunner.commitTransaction();
        return true;
      } else {
        await queryRunner.manager.delete(LikeArt, { art: artId });
        await queryRunner.commitTransaction();
        return false;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'like art!!!';
    } finally {
      await queryRunner.release();
    }
  }
}
