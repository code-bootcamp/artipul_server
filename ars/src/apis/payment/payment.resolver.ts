import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { UserService } from '../user/user.service';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,

    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async checkTimedoutAndProcess() {
    try {
      const arts = await this.paymentService.checkTimeout();
      arts.map(async (e) => {
        const bidInfo = await this.cacheManager.get(e.id);
        if (bidInfo) {
          const price = bidInfo[0];
          const bidder = await this.userService.findOne(bidInfo[1]);
          await this.paymentService.successfulBid(e.id, price, bidder, e.user);
        } else {
          await this.paymentService.failedBid(e.id);
        }

        await this.elasticsearchService.deleteByQuery({
          index: 'artipul00',
          query: {
            bool: {
              must: [{ match: { id: e.id } }],
            },
          },
        });

        return e.id;
      });

      return '';
    } catch (error) {
      throw error + 'checkout';
    }
  }

  @Cron('* * * * *')
  handleCron() {
    this.checkTimedoutAndProcess();
  }

  // 즉시 구매
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async instantBid(
    @Args('artId') artId: string,
    @Args('price') price: number,
    @Args('artistEmail') artistEmail: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    await this.cacheManager.del(artId);
    const artist = await this.userService.findOne(artistEmail);
    const bidder = await this.userService.findOne(currentUser.email);
    await this.paymentService.successfulBid(artId, price, bidder, artist);

    await this.elasticsearchService.deleteByQuery({
      index: 'artipul00',
      query: {
        bool: {
          must: [{ match: { id: artId } }],
        },
      },
    });

    return artId;
  }

  // 레디스에 입찰 정보(작품, 현재 입찰가, 현재 상위 입찰자)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => [String])
  async Bid(
    @Args('artId') artId: string,
    @Args('bid_price') bid_price: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.paymentService.call(artId, bid_price, currentUser.email);
  }

  // DB 저장
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async saveBid(
    @Args('artId') artId: string,
    @Args('bid_price') bid_price: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    await this.paymentService.save(artId, currentUser.id, bid_price);
    return 'ok';
  }

  @Mutation(() => String)
  async enterBidRomm(@Args('artId') artId: string) {
    return await this.paymentService.room(artId);
  }
}
