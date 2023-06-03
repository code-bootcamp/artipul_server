import { Field, ObjectType } from '@nestjs/graphql';
import { Art } from 'src/apis/art/entities/art.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ArtImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isMain: boolean;

  @ManyToOne(() => Art, { eager: true })
  @Field(() => Art)
  art: Art;
}
