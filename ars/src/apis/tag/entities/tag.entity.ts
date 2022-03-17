import { Field, ObjectType } from '@nestjs/graphql';
import { Art } from 'src/apis/art/entities/art.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => Art, (arts) => arts.tags)
  @Field(() => [Art])
  arts: Art[];
}
