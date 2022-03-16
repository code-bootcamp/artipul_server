import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  phoneNum: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  nickname: string;
}
