import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GqlAuthRefreshGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
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
  retoreAccessToken(@CurrentUser() currentUser: ICurrentUser) {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
