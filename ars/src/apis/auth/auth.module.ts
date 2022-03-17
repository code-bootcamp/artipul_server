import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGoogleStrategy } from 'src/common/auth/jwt-social-goole.strategy';
import { JwtKakaoStrategy } from 'src/common/auth/jwt-social-kakao.strategy';
import { JwtNaverStrategy } from 'src/common/auth/jwt-social-naver.strategy';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controlloer';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  providers: [
    AuthResolver, //
    AuthService,
    UserService,
    JwtGoogleStrategy,
    JwtNaverStrategy,
    JwtKakaoStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
