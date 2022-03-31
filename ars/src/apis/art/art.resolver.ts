import { Sse, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { Engage } from '../engage/entities/engage.entity';
import { FileService } from '../file/file.service';
import { LikeArtService } from '../likeArt/likeArt.service';
import { PaymentService } from '../payment/payment.service';
import { ArtService } from './art.service';
import { CreateArtInput } from './dto/createArtInput';
import { Art } from './entities/art.entity';

@Resolver()
export class ArtResolver {
  constructor(
    private readonly artService: ArtService,
    private readonly fileService: FileService,
    private readonly likeArtService: LikeArtService,
    private readonly paymentService: PaymentService,
  ) {}

  @Query(() => [Art])
  async fetchArts(
    @Args({ name: 'tags', type: () => [String] }) tags: string[],
    @Args({ name: 'createdAt', defaultValue: '1970-2-10' }) createdAt: string,
  ) {
    return await this.artService.findAll(tags, createdAt);
  }

  @Query(() => Art)
  async fetchArt(@Args('artId') artId: string) {
    return await this.artService.findOne(artId);
  }

  @Query(() => [ArtImage])
  async fetchArtImages(@Args('artId') artId: string) {
    return await this.artService.findImages({ artId });
  }
  ///////////////////////////////////////////////////////////////////////////
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Number)
  async fetchEngageCount(@CurrentUser() currentUser: ICurrentUser) {
    return await this.artService.countEngage(currentUser.id);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Number)
  async fetchLikeArtCount(@CurrentUser() currentUser: ICurrentUser) {
    return await this.artService.countLikeArt(currentUser.id);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Number)
  async fetchSoldoutArtsCount(@CurrentUser() currentUser: ICurrentUser) {
    return await this.artService.countComletedAuctionArts(currentUser.id);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Number)
  async fetchTimedOutArtsCount(@CurrentUser() currentUser: ICurrentUser) {
    return await this.artService.countTimedoutArts(currentUser.id);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Number)
  async fetchAuctionArtsCount(@CurrentUser() currentUser: ICurrentUser) {
    return await this.artService.countAuctionArts(currentUser.id);
  }
  //////////////////////////////////////////////////////////////////////////

  // 미대생이 판매중인 작품 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Art])
  async fetchAuctionArts(
    @Args('page') page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.artService.findAuction({ currentUser }, page);
  }

  // 미대생 마감된 작품 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Art])
  async fetchTimedOutArt(
    @Args('page') page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.artService.fetchTimedOutArt(currentUser, page);
  }

  // 일반유저(내가) 구매한 작품 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Art])
  async fetchTransactionCompletedArts(
    @Args('page') page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.artService.findcompleteAuction({ currentUser }, page);
  }

  // 일반유저(내가) 경매 참여 중인 작품 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Engage])
  async fetchEngaging(
    @Args('page') page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.paymentService.findEngage(currentUser.id, page);
  }

  // 작품id로 해당 작가의 모든 작품 조회
  @Query(() => [Art])
  async fetchArtistWorks(@Args('artId') artId: string) {
    return await this.artService.findArtistWorks(artId);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Art)
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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async addLikeArt(
    @Args('artId') artId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.likeArtService.like(artId, currentUser.id);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Art])
  async fetchLikeArt(
    @Args('page') page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.likeArtService.find(currentUser.id, page);
  }
}
