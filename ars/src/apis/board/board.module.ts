import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImage } from '../boardImage/entities/boardImage.entity';
import { Comment } from '../comment/entities/comment.entity';
import { FileService } from '../file/file.service';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board, //
      BoardImage,
      Comment,
    ]),
  ],
  providers: [
    BoardResolver, //
    BoardService,
    FileService,
  ],
})
export class BoardModule {}
