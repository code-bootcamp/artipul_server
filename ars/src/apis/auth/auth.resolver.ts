import {
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,

    @Inject(CACHE_MANAGER)
    private readonly cachemanager: Cache,
  ) {}

  @Mutation(() => User)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const user = await this.userService.findOAuthUser({ email });
    if (!user)
      // 이메일 체크
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnauthorizedException('비밀번호가 틀렸습니다.');

    this.authService.setRefreshToken({ user, res: context.res });

    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(@CurrentUser() currentUser: ICurrentUser) {
    return this.authService.getAccessToken({ user: currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: any) {
    try {
      let RT = context.req.headers.cookie.split('Token=')[1];
      let AT = context.req.headers.authorization.split(' ')[1];
      let tem = Math.floor(Date.now() / 1000);

      jwt.verify(RT, 'myRefreshKey', async (err, payload) => {
        if (err) {
          throw err;
        }
        await this.cachemanager.set(RT, 'RefreshToken', {
          ttl: payload.exp - tem,
        });
      });

      jwt.verify(AT, 'myAccessKey', async (err, payload) => {
        if (err) {
          console.log(err, '*******');

          throw err;
        }
        await this.cachemanager.set(AT, 'AccessToken', {
          ttl: payload.exp - tem,
        });
      });
      return '로그아웃에 성공했습니다.';
    } catch (error) {
      console.log(error, ' !!! ');
      throw error;
    }
  }
}
