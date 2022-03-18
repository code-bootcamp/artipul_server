import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { CreateUserInput } from './dto/createUserInput';
import { User } from './entities/user.entity';
import axios from 'axios';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async findOne(email) {
    return await this.userRepository.findOne({ email });
  }

  async findOAuthUser({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async checkNickname(nickname) {
    const user = await this.userRepository.findOne({ nickname });
    if (user) {
      return '이미 존재하는 닉네임 입니다.';
    } else {
      return '사용 가능한 닉네임 입니다.';
    }
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

  async sendTokenTOSMS(phoneNum, token) {
    try {
      const appKey = process.env.SMS_APP_KEY;
      const XSecretKey = process.env.SMS_X_SECRET_KEY;
      const sender = process.env.SMS_SENDER;
      const result = await axios.post(
        `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKey}/sender/sms`,
        {
          body: `안녕하세요, 인증번호는 [${token}]입니다.`,
          sendNo: sender,
          recipientList: [{ internationalRecipientNo: phoneNum }],
        },
        {
          headers: {
            'X-Secret-key': XSecretKey,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      );
    } catch (error) {
      throw error + '!!! sendTokenTOSMS';
    }
  }

  async saveToken(phoneNum, newToken) {
    try {
      await this.cacheManager.set(`phoneNum: ${phoneNum}`, newToken, {
        ttl: 180,
      });
    } catch (error) {
      throw error + '!!! saveToken';
    }
  }

  async checkToken(phoneNum, token) {
    try {
      const t = await this.cacheManager.get(`phoneNum: ${phoneNum}`);
      if (t === token) {
        await this.cacheManager.del(`phoneNum: ${phoneNum}`);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error + '!!! checkToken';
    }
  }
}
