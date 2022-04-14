import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { Payment } from 'src/apis/payment/entities/payment.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column()
  @Field(() => String)
  deadline: string;

  @Column({ default: false })
  @Field(() => Boolean)
  is_soldout: boolean;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @ManyToOne(() => User, { eager: true })
  @Field(() => User)
  user: User;

  @OneToOne(() => Payment, (payment) => payment.art)
  @Field(() => Payment)
  payment: Payment;

  @Column()
  @Field(() => String)
  tag1: string;

  @Column({ nullable: true, default: null })
  @Field(() => String, { nullable: true })
  tag2?: string;

  @Column({ nullable: true, default: null })
  @Field(() => String, { nullable: true })
  tag3?: string;

  @Column({ nullable: true, default: null })
  @Field(() => String, { nullable: true })
  tag4?: string;
}
