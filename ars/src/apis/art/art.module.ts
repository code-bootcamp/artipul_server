import { Module } from '@nestjs/common';
import {
  ElasticsearchModule,
  ElasticsearchService,
} from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { Engage } from '../engage/entities/engage.entity';
import { EventGateway } from '../event/event.gateway';
import { EventModule } from '../event/event.module';
import { FileService } from '../file/file.service';
import { LikeArtService } from '../likeArt/likeArt.service';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentService } from '../payment/payment.service';
import { User } from '../user/entities/user.entity';
import { ArtResolver } from './art.resolver';
import { ArtService } from './art.service';
import { Art } from './entities/art.entity';
import { ArtsSearch } from './entities/artsSearch.entity';
import { LikeArt } from './entities/likeArt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Art, //
      ArtImage,
      LikeArt,
      User,
      Payment,
      Engage,
      ArtsSearch,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
    EventModule,
  ],
  providers: [
    ArtResolver, //
    ArtService,
    FileService,
    LikeArtService,
    PaymentService,
  ],
})
export class ArtModule {}
