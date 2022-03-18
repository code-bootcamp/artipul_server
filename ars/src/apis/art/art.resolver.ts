import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ArtService } from './art.service';
import { CreateArtInput } from './dto/createArtInput';
import { Art } from './entities/art.entity';

@Resolver()
export class ArtResolver {
  constructor(private readonly artService: ArtService) {}

  @Query(() => [Art])
  async fetchArts() {
    return await this.artService.findAll();
  }

  @Query(() => Art)
  async fetchArt(@Args('title') title: string) {
    return await this.artService.findOne({ title });
  }

  @Mutation(() => Art)
  createArt(@Args('createArtInput') createArtInput: CreateArtInput) {
    return this.artService.create({ createArtInput });
  }
}
