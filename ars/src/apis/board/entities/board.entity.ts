import { Field, ObjectType } from '@nestjs/graphql';
import { BoardImage } from 'src/apis/boardImage/entities/boardImage.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
