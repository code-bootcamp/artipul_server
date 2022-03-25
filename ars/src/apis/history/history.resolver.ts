import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { History } from './entities/history.entity';
import { HistorySerive } from './history.service';

@Resolver()
export class HistoryResolver {
  constructor(private readonly historyService: HistorySerive) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [History])
  async fetchHistory(
    // @Args('artId') artId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.historyService.findAll(currentUser);
  }
}
