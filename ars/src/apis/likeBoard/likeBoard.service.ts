import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeBoard } from '../board/entities/likeBoard.entity';

@Injectable()
export class LikeBoardService {
  constructor(
    @InjectRepository(LikeBoard)
    private readonly likeBoardRepository: Repository<LikeBoard>,
  ) {}

  async find(userId) {
    const arts = await this.likeBoardRepository.find({ userId: userId });
    return arts.map((ele) => ele.board);
  }

  async like(boardId, userId) {
    try {
      const prevLike = await this.likeBoardRepository.findOne({
        userId: userId,
      });
      if (prevLike.board !== boardId) {
        await this.likeBoardRepository.save({
          userId: userId,
          board: boardId,
        });
      } else {
        await this.likeBoardRepository.delete({ userId: userId });
      }
      return true;
    } catch (error) {
      throw error + 'like board!!!';
    }
  }

  async count(boardID) {
    return await this.likeBoardRepository.count({
      where: { board: boardID },
    });
  }
}
