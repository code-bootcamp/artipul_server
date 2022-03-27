import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BoardImage } from '../boardImage/entities/boardImage.entity';
import { FileService } from '../file/file.service';
import { LikeBoardService } from '../likeBoard/likeBoard.service';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoardInput';
import { UpdateBoardInput } from './dto/updateBoardInput';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService,
    private readonly fileService: FileService,
    private readonly likeBoardService: LikeBoardService,
  ) {}

  // 게시물 1개 조회
  @Query(() => Board)
  async fetchBoard(@Args('boardId') boardId: string) {
    return await this.boardService.findOne(boardId);
  }

  // 게시물 이미지 조회
  @Query(() => [BoardImage])
  async fetchBoardImgaes(@Args('boardId') boardId: string) {
    return await this.boardService.findImage({ boardId });
  }

  // 게시물 모두 조회
  @Query(() => [Board])
  async fetchBoards() {
    return await this.boardService.findAll();
  }

  // 내가 쓴 게시물 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  async fetchBoardsOfMine(@CurrentUser() currentUser: ICurrentUser) {
    return await this.boardService.findMine({ currentUser });
  }

  // 게시물 등록
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.create({ ...createBoardInput }, currentUser);
  }

  // 게시물 수정
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: String,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.update(
      { ...updateBoardInput },
      boardId,
      currentUser,
    );
  }

  // 게시물 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteBoard(@Args('boardId') boardId: string) {
    return await this.boardService.delete({ boardId });
  }

  // 게시물 이미지 업로드
  @Mutation(() => [String])
  async uploadBoardImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return await this.fileService.upload({ files });
  }

  // 게시글 좋아요 개수 조회
  @Query(() => Int)
  async countLikeBoard(@Args('boardId') boardId: string) {
    return await this.likeBoardService.count(boardId);
  }

  // 좋아요 기능
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Int)
  async addLikeBoard(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.likeBoardService.like(boardId, currentUser.id);
  }

  // 내가 좋아요 한 글 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  async fetchLikeBoard(@CurrentUser() currentUser: ICurrentUser) {
    return await this.likeBoardService.find(currentUser.id);
  }
}
