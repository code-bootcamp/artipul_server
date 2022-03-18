import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ArtService } from './art.service';
import { CreateArtInput } from './dto/createArtInput';
import { Art } from './entities/art.entity';

@Resolver()
export class ArtResolver {
  constructor(private readonly artService: ArtService) {}

  @Mutation(() => Art)
  createArt(@Args('createArtInput') createArtInput: CreateArtInput) {
    return this.artService.create({ createArtInput });
  }
}
