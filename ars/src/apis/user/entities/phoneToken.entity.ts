import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class PhoneToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  token: string;

  @Field(() => String)
  @Column()
  phone: string;

  @Field(() => String)
  @Column()
  isAuth: boolean;
}
