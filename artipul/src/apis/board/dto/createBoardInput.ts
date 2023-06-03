import { Field, InputType } from '@nestjs/graphql';
import { Art } from 'src/apis/art/entities/art.entity';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => [String])
  image_urls: string[];
}
