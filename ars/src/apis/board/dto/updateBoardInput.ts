import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBoardInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => [String], { nullable: true })
  image_urls: string[];
}
