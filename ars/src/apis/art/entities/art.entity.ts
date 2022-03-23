import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ArtImage } from 'src/apis/artImage/entities/artImage.entity';
import { ArtTag } from 'src/apis/art_tag/entities/art_tag.entity';
import { Tag } from 'src/apis/tag/entities/tag.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => User, { eager: true })
  @Field(() => User)
  user: User;
}
