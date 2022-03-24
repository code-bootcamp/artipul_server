import { Resolver, Query, Args } from '@nestjs/graphql';
import { Tag } from '../tag/entities/tag.entity';
import { ArtTagService } from './art_tag.service';

@Resolver()
export class ArtTagResolver {
  constructor(private readonly artTagService: ArtTagService) {}

  @Query(() => [Tag])
  async fetchArtTags(@Args('artId') artId: string) {
    return await this.artTagService.findTag({ artId });
  }
}
