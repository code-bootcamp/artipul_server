import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSocialUser {
  @Field(() => String)
  email: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  phoneNum: string;

  @Field(() => Boolean)
  is_artist: boolean;

  @Field(() => String, { nullable: true })
  college?: string;
}
