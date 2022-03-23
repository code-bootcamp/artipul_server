import { Field, ObjectType } from '@nestjs/graphql';
import { Art } from 'src/apis/art/entities/art.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ArtTag {
  @PrimaryColumn()
  tagId: number;

  @ManyToOne(() => Art)
  art: Art;
}
