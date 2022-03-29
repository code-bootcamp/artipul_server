import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentResolver } from './payment.resolver';
import { PaymentServie } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [
    PaymentResolver, //
    PaymentServie,
  ],
})
export class PaymentModule {}
