import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly connection: Connection,
  ) {}

  async findOne(userId) {
    return await this.profileRepository.findOne({ user: userId });
  }

  async create({ ...createProfileInput }, currentUser) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const prevProfile = await queryRunner.manager.findOne(Profile, {
        user: currentUser.id,
      });

      let profile = null;
      if (prevProfile) {
        profile = await queryRunner.manager.save(Profile, {
          ...createProfileInput,
          id: prevProfile.id,
        });
      } else {
        profile = await queryRunner.manager.save(Profile, {
          ...createProfileInput,
          user: currentUser.id,
        });
      }
      await queryRunner.commitTransaction();
      return profile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + 'profile create !';
    } finally {
      await queryRunner.manager.release();
    }
  }
}
