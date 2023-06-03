import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { PointTransaction } from '../pointTransaction/entities/pointTransaction.entity';
import { History } from './entities/history.entity';
import { HistoryResolver } from './history.resolver';
import { HistorySerive } from './history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PointTransaction, History])],
  providers: [HistorySerive, HistoryResolver],
})
export class HistoryModule {}
