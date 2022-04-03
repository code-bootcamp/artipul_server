import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Art } from './art.entity';

@Entity()
@ObjectType()
export class LikeArt {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  userId: string;

  @ManyToOne(() => Art, { eager: true })
  @Field(() => Art)
  art: Art;
}
