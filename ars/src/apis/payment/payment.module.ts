import { Module } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtService } from '../art/art.service';
import { Art } from '../art/entities/art.entity';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { Engage } from '../engage/entities/engage.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Art, //
      ArtImage,
      User,
      Payment,
      Engage,
    ]),
  ],
  providers: [
    PaymentResolver, //
    PaymentService,
    ArtService,
    UserService,
  ],
})
export class PaymentModule {}
