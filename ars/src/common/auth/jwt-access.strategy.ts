import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cachemanager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    // let AT = req.headers.authorization.split(' ')[1];
    // console.log(AT);
    // if (await this.cachemanager.get(AT)) {
    //   throw new UnauthorizedException('액세스 토큰 에러 ~');
    // }

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
