import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUserInput';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { UpdateSocialUser } from './dto/updateSocialUserInput';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchUser(@CurrentUser() currentUser: ICurrentUser) {
    return await this.userService.findOne(currentUser.email);
  }

  @Query(() => String)
  async findUserEmail(@Args('phoneNum') phoneNum: string) {
    return await this.userService.findUserEmail({ phoneNum });
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

  @Mutation(() => User)
  async updateSocialUser(
    @Args('updateSocialUser') updateSocialUser: UpdateSocialUser,
  ) {
    return await this.userService.updateSocialUser({
      ...updateSocialUser,
    });
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

  @Mutation(() => Boolean)
  async phoneAuth(
    @Args('phoneNum') phoneNum: string,
    @Args('token') token: string,
  ) {
    return await this.userService.checkToken(phoneNum, token);
  }

  @Mutation(() => Boolean)
  async checkNickname(@Args('nickname') nickname: string) {
    return await this.userService.checkNickname(nickname);
  }

  @Mutation(() => User)
  async resetUserPassword(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const checkPassword = await this.userService.checkPassword(email);
    const isPassowrd = await bcrypt.compare(password, checkPassword.password);
    if (isPassowrd) {
      throw new Error('동일한 비밀번호입니다. 다른 비밀번호를 입력해주세요.');
    }
    const hashedPassword = await bcrypt.hash(password, 1);
    return await this.userService.reset({ email, hashedPassword });
  }
}
