import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BoardImage } from '../boardImage/entities/boardImage.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(BoardImage)
    private readonly boardImageRepository: Repository<BoardImage>,

    private readonly connection: Connection,
  ) {}

  // 게시물 1개 조회
  async findOne(boardId: string) {
    return await this.boardRepository.findOne(boardId);
  }

  // 게시물 이미지 조회
  async findImage({ boardId }) {
    return await this.boardImageRepository.find({ board: boardId });
  }

  // 게시물 모두 조회
  async findAll() {
    return await this.boardRepository.find();
  }

  // 내가 쓴 게시물 조회
  async findMine({ currentUser }, page) {
    return await this.boardRepository.find({
      skip: 10,
      take: 10,
      where: { user: currentUser },
    });
  }

  async countMine(userId) {
    return await this.boardRepository.count({
      user: userId,
    });
  }

  // 게시물 등록
  async create({ image_urls, ...rest }, currentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.save(Board, {
        ...rest,
        user: currentUser,
        thumbnail: image_urls[0],
      });

      for (let i = 0; i < image_urls.length; i++) {
        if (i === 0) {
          await queryRunner.manager.save(BoardImage, {
            url: image_urls[i],
            is_main: true,
            board: result,
          });
        } else {
          await queryRunner.manager.save(BoardImage, {
            url: image_urls[i],
            board: result,
          });
        }
      }
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'create';
    } finally {
      await queryRunner.release();
    }
  }

  // 게시물 수정
  async update({ image_urls, ...rest }, boardId, currentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const board = await queryRunner.manager.findOne(Board, { id: boardId });
      const result = await queryRunner.manager.save(Board, {
        ...board,
        ...rest,
        user: currentUser,
        thumbnail: image_urls[0],
      });

      for (let i = 0; i < image_urls.lenght; i++) {
        if (i === 0) {
          await queryRunner.manager.save(BoardImage, {
            url: image_urls[i],
            is_main: true,
            board: result,
          });
        } else {
          await queryRunner.manager.save(BoardImage, {
            url: image_urls[i],
            board: result,
          });
        }
      }

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'update';
    } finally {
      await queryRunner.release();
    }
  }

  // 게시물 삭제
  async delete({ boardId }) {
    await this.boardImageRepository.delete({ board: boardId });
    await this.commentRepository.delete({ board: boardId });
    const result = await this.boardRepository.delete({ id: boardId });
    return result.affected ? true : false;
  }
}
