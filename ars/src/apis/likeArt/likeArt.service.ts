import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeArt } from '../art/entities/likeArt.entity';

@Injectable()
export class LikeArtService {
  constructor(
    @InjectRepository(LikeArt)
    private readonly likeArtRepository: Repository<LikeArt>,
  ) {}

  async find(userId, page) {
    const arts = await this.likeArtRepository.find({
      take: 10,
      skip: 10 * (page - 1),
      where: { userId: userId },
    });
    return arts.map((ele) => ele.art);
  }

  async like(artId, userId) {
    try {
      const prevLike = await this.likeArtRepository.findOne({
        where: {
          userId: userId,
          art: artId,
        },
      });
      if (!prevLike) {
        await this.likeArtRepository.save({
          userId: userId,
          art: artId,
        });
      } else {
        await this.likeArtRepository.delete({ art: artId });
      }
      return true;
    } catch (error) {
      throw error + 'like art!!!';
    }
  }
}
