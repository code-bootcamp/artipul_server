import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Profile } from 'src/apis/profile/entities/profile.entity';
import { Payment } from 'src/apis/payment/entities/payment.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ default: null })
  @Field(() => String)
  phoneNum: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column({ default: null })
  @Field(() => String)
  nickname: string;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @Column({ default: null })
  @Field(() => Boolean)
  is_artist: boolean;

  @Column({ default: null })
  @Field(() => String)
  college?: string;

  @OneToOne(() => Profile)
  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @OneToMany(() => Payment, (payment) => payment.user)
  @Field(() => Payment)
  payment: Payment;
}
