import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { ArtTag } from '../art_tag/entities/art_tag.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Art } from './entities/art.entity';

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art)
    private readonly artRepository: Repository<Art>,

    @InjectRepository(ArtImage)
    private readonly artImageRepository: Repository<ArtImage>,

    private readonly connection: Connection,
  ) {}

  async findAll() {
    return await this.artRepository.find();
  }

  async findOne(artId: string) {
    return await this.artRepository.findOne(artId);
  }

  async findImages({ artId }) {
    return await this.artImageRepository.find({ art: artId });
  }

  // 미대생이 판매중인 작품 조회
  async findAction({ currentUser }) {
    const art = await this.artRepository.find({
      relations: ['user'],
      where: { user: currentUser.id, is_soldout: false },
    });
    return art;
  }

  // 일반유저(내가) 구매한 작품 조회
  async findcompleteAction({ currentUser }) {
    const art = await this.artRepository.find({
      relations: ['user'],
      where: { user: currentUser.id, is_soldout: true },
    });
    return art;
  }

  async create({ image_urls, tags, ...rest }, currentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.save(Art, {
        ...rest,
        user: currentUser,
        thumbnail: image_urls[0],
      });

      for (let i = 0; i < image_urls.length; i++) {
        if (i === 0) {
          await queryRunner.manager.save(ArtImage, {
            url: image_urls[i],
            isMain: true,
            art: result,
          });
        } else {
          await queryRunner.manager.save(ArtImage, {
            url: image_urls[i],
            art: result,
          });
        }
      }

      for (let i = 0; i < tags.length; i++) {
        await queryRunner.manager.save(ArtTag, {
          tagId: tags[i],
          art: result,
        });
      }

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
