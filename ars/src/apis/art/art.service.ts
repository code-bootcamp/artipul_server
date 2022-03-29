import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, MoreThan, Not, Repository } from 'typeorm';
import { ArtImage } from '../artImage/entities/artImage.entity';
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

  async findAll(tags, createdAt) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const num = tags.length;
      let result = [];

      switch (num) {
        case 4:
          result = await this.artRepository.find({
            where: {
              tag1: tags[0],
              tag2: tags[1],
              tag3: tags[2],
              tag4: tags[3],
              createdAt: MoreThan(createdAt),
            },
            order: { createdAt: 'ASC' },
            take: 9,
          });
          break;
        case 3:
          result = await this.artRepository.find({
            where: {
              tag1: tags[0],
              tag2: tags[1],
              tag3: tags[2],
              createdAt: MoreThan(createdAt),
            },
            order: { createdAt: 'ASC' },
            take: 9,
          });
          break;
        case 2:
          result = await this.artRepository.find({
            where: {
              tag1: tags[0],
              tag2: tags[1],
              createdAt: MoreThan(createdAt),
            },
            order: { createdAt: 'ASC' },
            take: 9,
          });
          break;
        case 1:
          result = await this.artRepository.find({
            where: {
              tag1: tags[0],
              createdAt: MoreThan(createdAt),
            },
            order: { createdAt: 'ASC' },
            take: 9,
          });
      }
      await queryRunner.commitTransaction();
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
  async findAuction({ currentUser }) {
    const art = await this.artRepository.find({
      where: { user: currentUser.id, is_soldout: false },
    });
    return art;
  }

  // 미대생 마감된 작품 조회
  async fetchTimedOutArt(currentUser) {
    const art = await this.artRepository.find({
      withDeleted: true,
      where: { user: currentUser.id, deletedAt: Not(null) },
    });
    return art;
  }

  // 일반유저(내가) 구매한 작품 조회
  async findcompleteAuction({ currentUser }) {
    const art = await this.artRepository.find({
      withDeleted: true,
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
}
