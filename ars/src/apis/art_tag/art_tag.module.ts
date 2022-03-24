import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { ArtTagResolver } from './art_tag.resolver';
import { ArtTagService } from './art_tag.service';
import { ArtTag } from './entities/art_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtTag, Tag])],
  providers: [
    ArtTagResolver, //
    ArtTagService,
  ],
})
export class ArtTagModule {}
