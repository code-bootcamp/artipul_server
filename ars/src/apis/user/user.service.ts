import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { CreateUserInput } from './dto/createUserInput';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async findOne(userInput) {
    if (userInput.includes('@')) {
      return await this.userRepository.findOne({ email: userInput });
    } else {
      return await this.userRepository.findOne({ nickname: userInput });
    }
  }

  async findOAuthUser({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async create({ hashedPassword: password, ...rest }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.save(User, {
        password,
        ...rest,
      });

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error + '화이팅 ㅎㅎ';
    } finally {
      await queryRunner.release();
    }
  }
}
