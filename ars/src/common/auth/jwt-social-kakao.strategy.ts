import { Strategy, Profile } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    const kakaoId = process.env.KAKAO_ID;
    const kakaoSecret = process.env.KAKAO_SECRET;
    super({
      clientID: kakaoId,
      clientSecret: kakaoSecret,
      callbackURL: 'http://localhost:3000/login/kakao/callback',
      scope: ['account_email', 'profile_nickname'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(profile);
    return {
      email: profile._json.kakao_account.email,
      password: profile.id,
      name: profile.displayName,
      // age: 0,
    };
  }
}
