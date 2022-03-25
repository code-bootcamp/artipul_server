import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProfileInput {
  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  introduce?: string;

  @Field(() => String, { nullable: true })
  address?: string;
}
