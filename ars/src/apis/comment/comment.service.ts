import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Board } from '../board/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private readonly connection: Connection,
  ) {}

  async findComment(boardId) {
    return await this.commentRepository.find({ board: boardId });
  }

  async create(boardId, content, currentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const board = await queryRunner.manager.findOne(Board, { id: boardId });
      const comment = await queryRunner.manager.save(Comment, {
        content,
        board,
        user: currentUser,
      });
      await queryRunner.commitTransaction();
      return comment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'Comment create';
    } finally {
      await queryRunner.release();
    }
  }
}
