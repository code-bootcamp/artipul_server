import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUserInput';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchUser(@CurrentUser() currentUser: ICurrentUser) {
    return await this.userService.findOne(currentUser.email);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const { password, ...rest } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 1);
    const savedEmail = await this.userService.findOne(rest.email);
    if (savedEmail) {
      throw new Error('이미 가입 된 이메일 입니다 ~');
    }
    return await this.userService.create({ hashedPassword, ...rest });
  }

  @Mutation(() => String)
  async sendPhoneToken(@Args('phoneNum') phoneNum: string) {
    if (phoneNum.length !== 10 && phoneNum.length !== 11) {
      throw new Error('핸드폰 번호를 제대로 입력 해 주세요');
    }
    const newToken = String(Math.floor(Math.random() * 10 ** 6)).padStart(
      6,
      '0',
    );

    await this.userService.saveToken(phoneNum, newToken);
    await this.userService.sendTokenTOSMS(phoneNum, newToken);
    return '인증번호 전송 완료 ~';
  }

  @Mutation(() => String)
  async phoneAuth(
    @Args('phoneNum') phoneNum: string,
    @Args('token') token: string,
  ) {
    return await this.userService.checkToken(phoneNum, token);
  }

  @Mutation(() => String)
  async checkNickname(@Args('nickname') nickname: string) {
    return await this.userService.checkNickname(nickname);
  }
}
