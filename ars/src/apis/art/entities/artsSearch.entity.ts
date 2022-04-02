import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ArtsSearch {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => Int)
  start_price: number;

  @Column()
  @Field(() => Int)
  instant_bid: number;

  @Column()
  @Field(() => String)
  thumbnail: string;

  @Column()
  @Field(() => String, { nullable: true })
  deadline: string;

  @Column({ default: false })
  @Field(() => Boolean)
  is_soldout: boolean;

  @Column()
  @Field(() => String)
  tag1: string;

  @Column({ nullable: true, default: null })
  @Field(() => String, { nullable: true })
  tag2?: string;

  @Column({ nullable: true, default: null })
  @Field(() => String, { nullable: true })
  tag3?: string;

  @Column({ nullable: true, default: null })
  @Field(() => String, { nullable: true })
  tag4?: string;

  @Column()
  @Field(() => String)
  nickname: string;
}
