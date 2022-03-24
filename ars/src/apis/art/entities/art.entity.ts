import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Art {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  start_price: number;

  @Column()
  @Field(() => Int)
  instant_bid: number;

  @Column({ default: null })
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => String)
  thumbnail: string;

  @CreateDateColumn()
  createdAt: string;

  @Column()
  @Field(() => String)
  deadline: string;

  @Column({ default: true })
  @Field(() => Boolean)
  is_soldout: boolean;

  @ManyToOne(() => User, { eager: true })
  @Field(() => User)
  user: User;
}
