import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class BoardImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: false })
  @Field(() => String)
  url: string;

  @Column({ default: false })
  @Field(() => Boolean)
  is_main: boolean;

  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;
}
