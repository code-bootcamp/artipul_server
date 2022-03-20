import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum POINTTRANSACTION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCLE = 'CANCLE',
}

registerEnumType(POINTTRANSACTION_STATUS_ENUM, {
  name: 'POINTTRANSACTION_ENUM',
});

@Entity()
@ObjectType()
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => Int)
  charge_amount: number;

  @Column({ type: 'enum', enum: POINTTRANSACTION_STATUS_ENUM })
  @Field(() => POINTTRANSACTION_STATUS_ENUM)
  status: POINTTRANSACTION_STATUS_ENUM;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
