import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Board } from '../board/entities/board.entity';
import { LikeBoard } from '../board/entities/likeBoard.entity';

@Injectable()
export class LikeBoardService {
  constructor(
    @InjectRepository(LikeBoard)
    private readonly likeBoardRepository: Repository<LikeBoard>,

    private readonly connection: Connection,
  ) {}

  async find(userId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const boards = await queryRunner.manager.find(LikeBoard, {
        where: { userId },
        relations: ['board'],
        lock: { mode: 'pessimistic_write' },
      });
      await queryRunner.commitTransaction();
      return boards.map((ele) => ele.board);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'find board!!!';
    } finally {
      await queryRunner.manager.release();
    }
  }

  async like(boardId, userId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const board = await queryRunner.manager.findOne(Board, { id: boardId });
      const prevLike = await queryRunner.manager.findOne(LikeBoard, {
        where: {
          userId: userId,
          board: boardId,
        },
        relations: ['board'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!prevLike) {
        await queryRunner.manager.save(LikeBoard, {
          userId: userId,
          board: board,
        });
        await queryRunner.commitTransaction();
        return true;
      } else {
        await queryRunner.manager.delete(LikeBoard, { board: boardId });
        await queryRunner.commitTransaction();
        return false;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'like board!!!';
    } finally {
      await queryRunner.manager.release();
    }
  }

  async count(boardID) {
    return await this.likeBoardRepository.count({
      where: { board: boardID },
    });
  }
}
