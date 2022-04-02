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
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String)
  title: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column({ nullable: true })
  @Field(() => String)
  content: string;

  @Column()
  @Field(() => String)
  thumbnail: string;

  @ManyToOne(() => User, { eager: true })
  @Field(() => User)
  user: User;
}
