import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { CreateArtInput } from './dto/createArtInput';
import { Art } from './entities/art.entity';

interface ICreate {
  createArtInput: CreateArtInput;
}

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art)
    private readonly artRepository: Repository<Art>,
  ) {}

  async create({ createArtInput }: ICreate) {
    return await this.artRepository.save({ ...createArtInput });
  }
}
