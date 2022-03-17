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
export class PointCharge {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Field(() => Int)
  charge_amount: number;

  @Column({ default: true })
  @Field(() => Boolean)
  is_pay: boolean;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
