import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Art } from '../art/entities/art.entity';
import { ArtTag } from '../art_tag/entities/art_tag.entity';
import { BoardImage } from '../boardImage/entities/boardImage.entity';
import { Comment } from '../comment/entities/comment.entity';
import { FileService } from '../file/file.service';
import { Tag } from '../tag/entities/tag.entity';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Art, //
      ArtTag,
      Board,
      BoardImage,
      Comment,
      // Tag,
    ]),
  ],
  providers: [
    BoardResolver, //
    BoardService,
    FileService,
  ],
})
export class BoardModule {}
