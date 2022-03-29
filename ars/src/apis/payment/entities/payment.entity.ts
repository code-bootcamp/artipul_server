import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Art } from 'src/apis/art/entities/art.entity';
import { PointTransaction } from 'src/apis/pointTransaction/entities/pointTransaction.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => Int)
  amount: number;

  @JoinColumn()
  @OneToOne(() => Art)
  @Field(() => Art)
  art: Art;

  @ManyToOne(() => User, { eager: true })
  @Field(() => User)
  user: User;
}
