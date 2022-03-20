import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../user/entities/user.entity';
import { PointTransaction } from './entities/pointTransaction.entity';
import { PointTransactionResolver } from './pointTransaction.resolver';
import { PointTransactionServive } from './pointTransaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointTransaction, User])],
  providers: [
    PointTransactionResolver, //
    PointTransactionServive,
    IamportService,
  ],
})
export class PointTransactionModule {}
