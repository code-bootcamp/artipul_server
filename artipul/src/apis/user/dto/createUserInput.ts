import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  phoneNum: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  nickname: string;

  @Field(() => Boolean)
  is_artist: boolean;

  @Field(() => String, { nullable: true })
  college?: string;
}
