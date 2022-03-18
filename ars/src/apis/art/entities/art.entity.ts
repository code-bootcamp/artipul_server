import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tag } from 'src/apis/tag/entities/tag.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  start_price: number;

  @Column()
  @Field(() => Int)
  instant_bid: number;

  @Column()
  @Field(() => Int)
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Field(() => String)
  deadline: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => Tag, (tags) => tags.arts)
  tags: Tag[];
}
