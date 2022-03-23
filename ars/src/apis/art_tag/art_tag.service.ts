import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { ArtTag } from './entities/art_tag.entity';

@Injectable()
export class ArtTagService {
  constructor(
    @InjectRepository(ArtTag)
    private readonly artTagRepository: Repository<ArtTag>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}
  async findTag({ artId }) {
    const tagId = await this.artTagRepository.find({ art: artId });
    return Promise.all(
      tagId.map(async (ele) => {
        return await this.tagRepository.findOne({ id: ele.tagId });
      }),
    );
  }
}
