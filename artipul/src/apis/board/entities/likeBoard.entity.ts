import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity()
@ObjectType()
export class LikeBoard {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Board)
  board: Board;
}
