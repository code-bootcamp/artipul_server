import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Art } from '../art/entities/art.entity';
import { BoardImage } from '../boardImage/entities/boardImage.entity';
import { Comment } from '../comment/entities/comment.entity';
import { FileService } from '../file/file.service';
import { LikeBoardService } from '../likeBoard/likeBoard.service';
import { User } from '../user/entities/user.entity';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { LikeBoard } from './entities/likeBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Art, //
      Board,
      BoardImage,
      Comment,
      LikeBoard,
      User,
    ]),
  ],
  providers: [
    BoardResolver, //
    BoardService,
    FileService,
    LikeBoardService,
  ],
})
export class BoardModule {}
