import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CLIENT_CALLBACK,
      scope: ['profile_nickname', 'account_email'],
    });
  }
  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      email: profile._json.kakao_account.email,
      password: profile.id,
      name: profile.displayName,
    };
  }
}
