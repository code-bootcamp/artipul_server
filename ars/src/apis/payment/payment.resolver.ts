import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
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

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async checkTimedoutAndProcess() {
    try {
      const arts = await this.paymentService.checkTimeout();
      arts.map(async (e) => {
        const bidInfo = await this.cacheManager.get(e.id);
        const price = bidInfo[0];
        const bidder = await this.userService.findOne(bidInfo[1]);
        if (price) {
          await this.paymentService.successfulBid(e.id, price, bidder, e.user);
        } else {
          await this.paymentService.failedBid(e.id);
        }

        return e.id;
      });

      return '';
    } catch (error) {
      throw error + 'checkout';
    }
  }

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

    return artId;
  }

  // 입찰 API(임시)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => [String])
  async Bid(
    @Args('artId') artId: string,
    @Args('bid_price') bid_price: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.paymentService.call(artId, bid_price, currentUser.email);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async saveBid(
    @Args('artId') artId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    await this.paymentService.save(artId, currentUser.id);
    return 'ok';
  }
}
