import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Resolver()
export class CommnetResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment])
  async fetchComments(@Args('boardId') boardId: String) {
    return await this.commentService.findComment(boardId);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  async createComment(
    @Args('boardId') boardId: String,
    @Args('content') content: String,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.commentService.create(boardId, content, currentUser);
  }
}
