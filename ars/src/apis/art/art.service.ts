import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { CreateArtInput } from './dto/createArtInput';
import { Art } from './entities/art.entity';

interface ICreate {
  createArtInput: CreateArtInput;
}

interface IFindOne {
  title: string;
}

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art)
    private readonly artRepository: Repository<Art>,
  ) {}

  async findAll() {
    return await this.artRepository.find({
      withDeleted: true,
      relations: ['tags'],
    });
  }

  async findOne({ title }: IFindOne) {
    return await this.artRepository.findOne({
      where: { title },
      relations: ['tags'],
    });
  }

  async create({ createArtInput }: ICreate) {
    return await this.artRepository.save({ ...createArtInput });
  }
}
