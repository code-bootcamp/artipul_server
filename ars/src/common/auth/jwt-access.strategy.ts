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
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
      passReqToCallback: true,
    });
  }
  async validate(req, payload: any) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const check = await this.cacheManager.get(`A ${accessToken}`);

    if (check)
      throw new UnauthorizedException('이미 로그아웃이 된 상태입니다.');

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
