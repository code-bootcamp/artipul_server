import { Field, ObjectType } from '@nestjs/graphql';
import { Art } from 'src/apis/art/entities/art.entity';
import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ArtTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @PrimaryColumn()
  tagId: number;

  @ManyToOne(() => Art, { eager: true })
  @Field(() => Art)
  art: Art;
}
