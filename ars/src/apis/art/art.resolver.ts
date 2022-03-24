import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { FileService } from '../file/file.service';
import { Tag } from '../tag/entities/tag.entity';
import { ArtService } from './art.service';
import { CreateArtInput } from './dto/createArtInput';
import { Art } from './entities/art.entity';

@Resolver()
export class ArtResolver {
  constructor(
    private readonly artService: ArtService,
    private readonly fileService: FileService,
  ) {}

  @Query(() => [Art])
  async fetchArts() {
    return await this.artService.findAll();
  }

  @Query(() => Art)
  async fetchArt(@Args('artId') artId: string) {
    return await this.artService.findOne(artId);
  }

  @Query(() => [ArtImage])
  async fetchArtImages(@Args('artId') artId: string) {
    return await this.artService.findImages({ artId });
  }

  // 미대생이 판매중인 작품 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Art])
  async fetchActionArts(@CurrentUser() currentUser: ICurrentUser) {
    return await this.artService.findAction({ currentUser });
  }

  // 일반유저(내가) 구매한 작품 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Art])
  async fetchtransactioncompletedArts(
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.artService.findcompleteAction({ currentUser });
  }

  @Mutation(() => Art)
  @UseGuards(GqlAuthAccessGuard)
  createArt(
    @Args('createArtInput') createArtInput: CreateArtInput, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.artService.create({ ...createArtInput }, currentUser);
  }

  @Mutation(() => [String])
  async uploadArtImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return await this.fileService.upload({ files });
  }

  @Mutation(() => Tag)
  async createTag(@Args('id') id: string, @Args('name') name: string) {
    return await this.artService.tag(id, name);
  }
}
