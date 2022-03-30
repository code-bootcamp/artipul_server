import { Field, ObjectType } from '@nestjs/graphql';
import { Art } from 'src/apis/art/entities/art.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Engage {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Art, { eager: true })
  @Field(() => Art)
  art: Art;
}
