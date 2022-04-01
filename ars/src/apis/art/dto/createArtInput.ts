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

  @Field(() => Date)
  deadline: Date;

  @Field(() => [String])
  image_urls: string[];

  @Field(() => Boolean)
  is_soldout: boolean;

  @Field(() => [String])
  tags: string[];

  // @Field(() => String)
  // tag1: string;

  // @Field(() => String, { nullable: true })
  // tag2?: string;

  // @Field(() => String, { nullable: true })
  // tag3?: string;

  // @Field(() => String, { nullable: true })
  // tag4?: string;
}
