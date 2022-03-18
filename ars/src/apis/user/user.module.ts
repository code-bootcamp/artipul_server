import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { PhoneToken } from './entities/phoneToken.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Profile,
      PhoneToken,
    ]),
  ],
  providers: [
    UserResolver, //
    UserService,
  ],
})
export class UserModule {}
