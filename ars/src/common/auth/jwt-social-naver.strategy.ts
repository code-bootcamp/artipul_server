import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CLIENT_CALLBACK,
      scope: ['email', 'profile'],
    });
  }
  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      email: profile.email,
      password: profile.id,
      name: profile.name,
    };
  }
}
