import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BoardImage } from '../boardImage/entities/boardImage.entity';
import { FileService } from '../file/file.service';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoardInput';
import { UpdateBoardInput } from './dto/updateBoardInput';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService,
    private readonly fileService: FileService,
  ) {}

  @Query(() => Board)
  async fetchBoard(@Args('boardId') boardId: string) {
    return await this.boardService.findOne(boardId);
  }

  @Query(() => [BoardImage])
  async fetchBoardImgaes(@Args('boardId') boardId: string) {
    return await this.boardService.findImage({ boardId });
  }

  @Query(() => [Board])
  async fetchBoards() {
    return await this.boardService.findAll();
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
    return await this.fileService.uploads({ files });
  }
}
