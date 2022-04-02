import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Art } from './art.entity';

@Entity()
@ObjectType()
export class LikeArt {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Art, { eager: true })
  art: Art;
}
