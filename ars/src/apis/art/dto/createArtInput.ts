import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateArtInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  start_price: number;

  @Field(() => Int)
  instant_bid: number;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  deadline: string;

  @Field(() => [String])
  image_urls: string[];

  @Field(() => [Int])
  tags: number[];
}