import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { Tag } from '../tag/entities/tag.entity';
import { CreateArtInput } from './dto/createArtInput';
import { Art } from './entities/art.entity';

interface IFindOne {
  artId: string;
}

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art)
    private readonly artRepository: Repository<Art>,

    private readonly connection: Connection,
  ) {}

  async findAll() {
    return await this.artRepository.find({
      withDeleted: true,
      relations: ['tags'],
    });
  }

  async findOne({ artId }: IFindOne) {
    return await this.artRepository.findOne({
      where: { artId },
      relations: ['tags'],
    });
  }

  async create({ image_urls, is_main, ...rest }, currentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.save(Art, {
        ...rest,
        user: currentUser,
      });

      console.log(result);
      await queryRunner.manager.save(ArtImage, {
        url: image_urls,
        isMain: is_main,
        art: result,
      });

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'Art create !';
    } finally {
      await queryRunner.manager.release();
    }
  }

  async tag(id, name) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.save(Tag, {
        id,
        name,
      });
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.manager.release();
    }
  }
}
