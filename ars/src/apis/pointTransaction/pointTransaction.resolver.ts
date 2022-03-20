import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { IamportService } from '../iamport/iamport.service';
import { PointTransaction } from './entities/pointTransaction.entity';
import { PointTransactionServive } from './pointTransaction.service';

@Resolver()
export class PointTransactionResolver {
  constructor(
    private readonly pointTransactionService: PointTransactionServive,
    private readonly iamportService: IamportService,
  ) {}

  // 현재 포인트 내역 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => PointTransaction)
  async fetchPointTransaction(
    @Args('pointTransactionId') pointTransactionId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.pointTransactionService.findOne({ pointTransactionId });
  }

  // 포인트 내역 전체 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [PointTransaction])
  async fetchPointTransactions(@CurrentUser() currentUser: ICurrentUser) {
    const userId = currentUser.id;
    return await this.pointTransactionService.findAll(userId);
  }

  // 포인트 충전
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PointTransaction)
  async createPointTransaction(
    @Args('impUid') impUid: string,
    @Args('charge_amount') charge_amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    // 결제 검증(iamport.service.ts와 연결해서 검증)
    // 아임포트에 요청해서 결제 완료 기록이 존재하는지 확인
    const token = await this.iamportService.getToken();

    // 결제 내역 확인
    await this.iamportService.checkPaid({ impUid, charge_amount, token });

    // 중복 결제 확인
    await this.pointTransactionService.checkDuplicate({ impUid });

    return await this.pointTransactionService.create({
      impUid,
      charge_amount,
      currentUser,
    });
  }

  // 포인트 충전 취소
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PointTransaction)
  async cancelPointTransaction(
    @Args('impUid') impUid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    // 검증
    // 중복 취소 확인
    await this.pointTransactionService.checkAlreadyCanceled({ impUid });

    // 취소하기에 충분한 나의 누적 포인트인지 확인 API
    await this.pointTransactionService.checkHasCancellablePoint({
      impUid,
      currentUser,
    });

    // 아임포트 취소 요청
    const token = await this.iamportService.getToken();
    const canceledAmount = await this.iamportService.cancel({ impUid, token });

    // 결제 취소
    return await this.pointTransactionService.cancel({
      impUid,
      charge_amount: canceledAmount,
      currentUser,
    });
  }
}
