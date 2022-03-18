import { Strategy, Profile } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const googleId = process.env.GOOGLE_ID;
    const googleSecret = process.env.GOOGLE_SECRET;
    super({
      clientID: googleId,
      clientSecret: googleSecret,
      callbackURL: 'http://localhost:3000/login/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(profile);
    return {
      // user라는 객체로 감싸져서 리턴 됨.
      email: profile.emails[0].value,
      password: profile.id,
      name: profile.displayName,
    };
  }
}
