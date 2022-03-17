import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUserInput';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const { password, ...rest } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 1);

    return await this.userService.create({ hashedPassword, ...rest });
  }

  @Query(() => User)
  async fetchUser(@Args('userInput') userInput: string) {
    return await this.userService.findOne(userInput);
  }
}
