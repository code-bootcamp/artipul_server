import { UseGuards } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { FileService } from '../file/file.service';
import { LikeArtService } from '../likeArt/likeArt.service';
import { ArtService } from './art.service';
import { CreateArtInput } from './dto/createArtInput';
import { Art } from './entities/art.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Resolver()
export class ArtResolver {
  constructor(
    private readonly artService: ArtService,
    private readonly fileService: FileService,
    private readonly likeArtService: LikeArtService,
    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => [Art])
  async fetchArts(
    @Args('tag1') tag1: string,
    @Args('tag2', { nullable: true }) tag2: string,
    @Args('tag3', { nullable: true }) tag3: string,
    @Args('tag4', { nullable: true }) tag4: string,
  ) {
    // redis에 캐시되어 있는지 확인하기
    const redisValue = await this.cacheManager.get(
      `tag1: ${tag1}, tag2: ${tag2}, tag3: ${tag3}, tag4: ${tag4}`,
    );
    if (redisValue) {
      console.log(redisValue);
      return redisValue;
    }

    // 레디스에 캐시가 되어있지 않다면, 엘라스틱서치에서 조회하기(유저가 검색한 검색어로 조회하기)
    const result = await this.elasticsearchService.search({
      index: 'artipul',
      query: {
        bool: {
          should: [
            { match: { tag1: tag1 } },
            { match: { tag2: tag2 } },
            { match: { tag3: tag3 } },
            { match: { tag4: tag4 } },
          ],
        },
      },
    });

    if (!result.hits.hits.length) return null;

    const artTags = result.hits.hits.map((el: any) => ({
      id: el._source.id,
      title: el._source.title,
      start_price: el._source.start_price,
      instant_bid: el._source.instant_bid,
      price: el._source.price,
      deadline: el._source.deadline,
      tag1: el._source.tag1,
      tag2: el._source.tag2,
      tag3: el._source.tag3,
      tag4: el._source.tag4,
    }));

    // 엘라스틱서치에서 조회 결과가 있다면, 레디스에 검색결과 캐싱해놓기
    await this.cacheManager.set(
      `tag1: ${tag1}, tag2: ${tag2}, tag3: ${tag3}, tag4: ${tag4}`,
      artTags,
      { ttl: 0 },
    );
    // 최종 결과 브라우저에 리턴해주기
    return artTags;
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
  async fetchAuctionArts(@CurrentUser() currentUser: ICurrentUser) {
    return await this.artService.findAuction({ currentUser });
  }

  // 미대생 마감된 작품 조회
  @UseGuards(GqlAuthAccessGuard)
  async fetchTimedOutArt(@CurrentUser() currentUser: ICurrentUser) {
    return await this.artService.fetchTimedOutArt(currentUser);
  }

  // 일반유저(내가) 구매한 작품 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Art])
  async fetchtransactioncompletedArts(
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.artService.findcompleteAuction({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Art)
  async createArt(
    @Args('createArtInput') createArtInput: CreateArtInput, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    //엘라스틱서치에서 등록할때 한번 사용 후 주석
    // const result = await this.elasticsearchService.create({
    //   id: 'artipulid',
    //   index: 'artipul',
    //   document: {
    //     ...createArtInput,
    //     currentUser,
    //   },
    // });

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
  async fetchLikeArt(@CurrentUser() currentUser: ICurrentUser) {
    return await this.likeArtService.find(currentUser.id);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => [String])
  async Bid(
    @Args('artId') artId: string,
    @Args('bid_price') bid_price: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.artService.call(artId, bid_price, currentUser.email);
  }
}
