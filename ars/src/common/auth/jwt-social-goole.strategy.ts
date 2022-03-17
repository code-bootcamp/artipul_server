import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
      scope: ['email', 'profile'],
    });
  }
  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      email: profile.emails[0].value,
      password: profile.id,
      name: profile.displayName,
    };
  }
}
