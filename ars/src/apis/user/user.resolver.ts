import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUserInput';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createGeneral(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Args('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userService.createG({ createUserInput }, hashedPassword);
  }

  @Mutation(() => User)
  async createArtist(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Args('password') password: string,
    @Args('college') college: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userService.createA(
      { createUserInput },
      hashedPassword,
      college,
    );
  }

  @Query(() => User)
  async fetchUser(@Args('nickname') nickname: string) {
    return await this.userService.findOne({ nickname });
  }
}
