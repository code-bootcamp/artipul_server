import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Art } from 'src/apis/art/entities/art.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Field(() => Int)
  amount: number;

  @JoinColumn()
  @OneToOne(() => Art)
  @Field(() => Art)
  art: Art;
}
