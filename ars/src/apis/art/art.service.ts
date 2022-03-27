import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
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

  async findAll(tags) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const qb = getRepository(Art).createQueryBuilder('art');
      const num = tags.length;
      let result = [];

      switch (num) {
        case 1:
          result = await queryRunner.manager.find(Art, {
            where: { tag1: tags[0] },
          });
          break;

        case 2:
          result = await qb
            .where('art.tag1 = :tag1', { tag1: tags[0] })
            .andWhere('art.tag2 = :tag2', { tag2: tags[1] })
            .getMany();
          break;

        case 3:
          result = await qb
            .where('art.tag1 = :tag1', { tag1: tags[0] })
            .andWhere('art.tag2 = :tag2', { tag2: tags[1] })
            .andWhere('art.tag3 = :tag3', { tag3: tags[2] })
            .getMany();
          break;

        case 4:
          result = await qb
            .where('art.tag1 = :tag1', { tag1: tags[0] })
            .andWhere('art.tag2 = :tag2', { tag2: tags[1] })
            .andWhere('art.tag3 = :tag3', { tag3: tags[2] })
            .andWhere('art.tag4 = :tag4', { tag4: tags[3] })
            .getMany();
          break;
      }
      await queryRunner.commitTransaction();
      console.log(result, num);
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'Art fetch !!!';
    } finally {
      await queryRunner.manager.release();
    }
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

  // 작품 등록
  async create({ image_urls, tags, ...rest }, currentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.save(Art, {
        ...rest,
        user: currentUser,
        thumbnail: image_urls[0],
        tag1: tags[0],
        tag2: tags[1],
        tag3: tags[2],
        tag4: tags[3],
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

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'Art create !';
    } finally {
      await queryRunner.manager.release();
    }
  }

  // 태그 종류 추가
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
