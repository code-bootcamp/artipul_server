import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() { // private readonly cachemanager: Cache, // @Inject(CACHE_MANAGER)
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookies;
        return cookie.replace('refreshToken=', '');
      },
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    //   let RT = req.headers.cookie.split('Token=')[1];
    //   if (await this.cachemanager.get(RT)) {
    //     throw new UnauthorizedException('리프레시 토큰 에러 ~');
    //   }

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
