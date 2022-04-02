
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Art } from './art.entity';

@Entity()
@ObjectType()
export class LikeArt {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Art)
  art: Art;
}
