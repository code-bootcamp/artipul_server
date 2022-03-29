import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Payment } from 'src/apis/payment/entities/payment.entity';
import { PointTransaction } from 'src/apis/pointTransaction/entities/pointTransaction.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class History {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => Int)
  point: number;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => PointTransaction, { nullable: true })
  @Field(() => PointTransaction, { nullable: true })
  pointTransaction?: PointTransaction;

  @ManyToOne(() => Payment, { nullable: true })
  @Field(() => Payment, { nullable: true })
  payment?: Payment;
}
