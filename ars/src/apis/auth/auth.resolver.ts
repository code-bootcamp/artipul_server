import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { GqlAuthRefreshGuard } from 'src/common/auth/gql-auth.guard';
import * as jwt from 'jsonwebtoken';
// import { Cache } from 'cache-manager';
// import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, // private readonly cacheManager: Cache,
  ) // @Inject(CACHE_MANAGER)
  {}

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new UnprocessableEntityException('없는 아이디입니다.');

    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated)
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');

    this.authService.setRefreshToken({ user, res: context.res });

    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: any,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );

    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY) &&
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

      const User = { ...currentUser };
      const time = Math.floor(Date.now() / 1000);

      // const accTime = await this.cacheManager.set(
      //   `accessToken: ${accessToken}`,
      //   accessToken,
      //   {
      //     ttl: currentUser.exp - time,
      //   },
      // );

      // await this.cacheManager.set(
      //   `refreshToken: ${refreshToken}`,
      //   refreshToken,
      //   {
      //     ttl: currentUser.exp - time,
      //   },
      // );
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return '로그아웃에 성공하였습니다.';
  }
}
