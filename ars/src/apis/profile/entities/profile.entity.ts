import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  url?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  introduce?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address?: string;

  @JoinColumn()
  @OneToOne(() => User, { eager: true })
  @Field(() => User)
  user: User;
}
