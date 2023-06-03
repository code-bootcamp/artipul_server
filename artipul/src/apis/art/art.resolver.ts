import { UseGuards } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
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
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ArtsSearch } from './entities/artsSearch.entity';

@Resolver()
export class ArtResolver {
  constructor(
    private readonly artService: ArtService,
    private readonly fileService: FileService,
    private readonly likeArtService: LikeArtService,
    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly paymentService: PaymentService,
  ) {}

  @Query(() => [ArtsSearch])
  async fetchArts(
    @Args({ name: 'tags', type: () => [String] }) tags: string[],
  ) {
    if (tags.length === 1) {
      const redisValue = await this.cacheManager.get(`tags: ${tags}`);
      if (redisValue) {
        return redisValue;
      }
      const result = await this.elasticsearchService.search({
        index: 'artipul00',
        from: 0,
        size: 500,
        query: {
          bool: {
            must: [{ match: { tag1: tags[0] } }],
          },
        },
      });

      if (!result.hits.hits.length) return null;

      const artTags = result.hits.hits.map((el: any) => {
        return {
          id: el._source.id,
          title: el._source.title,
          start_price: el._source.start_price,
          instant_bid: el._source.instant_bid,
          deadline: el._source.deadline,
          thumbnail: el._source.thumbnail,
          tag1: el._source.tag1,
          nickname: el._source.nickname,
        };
      });

      // 엘라스틱서치에서 조회 결과가 있다면, 레디스에 검색결과 캐싱해놓기
      await this.cacheManager.set(`tags: ${tags}`, artTags, {
        ttl: 5,
      });
      return artTags;
    }

    if (tags.length === 2) {
      const redisValue = await this.cacheManager.get(`tags: ${tags}`);
      if (redisValue) {
        return redisValue;
      }

      const result = await this.elasticsearchService.search({
        index: 'artipul00',
        from: 0,
        size: 500,
        query: {
          bool: {
            must: [{ match: { tag1: tags[0] } }, { match: { tag2: tags[1] } }],
          },
        },
      });

      if (!result.hits.hits.length) return null;

      const artTags = result.hits.hits.map((el: any) => {
        return {
          id: el._source.id,
          title: el._source.title,
          start_price: el._source.start_price,
          instant_bid: el._source.instant_bid,
          deadline: el._source.deadline,
          is_soldout: el._source.is_soldout,
          thumbnail: el._source.thumbnail,
          tag1: el._source.tag1,
          tag2: el._source.tag2,
          nickname: el._source.nickname,
        };
      });

      // 엘라스틱서치에서 조회 결과가 있다면, 레디스에 검색결과 캐싱해놓기
      await this.cacheManager.set(`tags: ${tags}`, artTags, {
        ttl: 5,
      });
      return artTags;
    }

    if (tags.length === 3) {
      const redisValue = await this.cacheManager.get(`tags: ${tags}`);
      if (redisValue) {
        return redisValue;
      }

      const result = await this.elasticsearchService.search({
        index: 'artipul00',
        from: 0,
        size: 500,
        query: {
          bool: {
            must: [
              { match: { tag1: tags[0] } },
              { match: { tag2: tags[1] } },
              { match: { tag3: tags[2] } },
            ],
          },
        },
      });

      if (!result.hits.hits.length) return null;

      const artTags = result.hits.hits.map((el: any) => {
        return {
          id: el._source.id,
          title: el._source.title,
          start_price: el._source.start_price,
          instant_bid: el._source.instant_bid,
          deadline: el._source.deadline,
          thumbnail: el._source.thumbnail,
          tag1: el._source.tag1,
          tag2: el._source.tag2,
          tag3: el._source.tag3,
          nickname: el._source.nickname,
        };
      });

      // 엘라스틱서치에서 조회 결과가 있다면, 레디스에 검색결과 캐싱해놓기
      await this.cacheManager.set(`tags: ${tags}`, artTags, {
        ttl: 5,
      });
      return artTags;
    }

    if (tags.length === 4) {
      const redisValue = await this.cacheManager.get(`tags: ${tags}`);
      if (redisValue) {
        return redisValue;
      }

      const result = await this.elasticsearchService.search({
        index: 'artipul00',
        from: 0,
        size: 500,
        query: {
          bool: {
            must: [
              { match: { tag1: tags[0] } },
              { match: { tag2: tags[1] } },
              { match: { tag3: tags[2] } },
              { match: { tag4: tags[3] } },
            ],
          },
        },
      });

      if (!result.hits.hits.length) return null;

      const artTags = result.hits.hits.map((el: any) => {
        return {
          id: el._source.id,
          title: el._source.title,
          start_price: el._source.start_price,
          instant_bid: el._source.instant_bid,
          deadline: el._source.deadline,
          thumbnail: el._source.thumbnail,
          tag1: el._source.tag1,
          tag2: el._source.tag2,
          tag3: el._source.tag3,
          tag4: el._source.tag4,
          nickname: el._source.nickname,
        };
      });

      // 엘라스틱서치에서 조회 결과가 있다면, 레디스에 검색결과 캐싱해놓기
      await this.cacheManager.set(`tags: ${tags}`, artTags, {
        ttl: 5,
      });
      return artTags;
    }
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
  async createArt(
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
    @Args('page', { nullable: true }) page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.likeArtService.find(currentUser.id, page);
  }
}
