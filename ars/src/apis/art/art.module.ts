import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { Engage } from '../engage/entities/engage.entity';
import { FileService } from '../file/file.service';
import { LikeArtService } from '../likeArt/likeArt.service';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentService } from '../payment/payment.service';
import { User } from '../user/entities/user.entity';
import { ArtResolver } from './art.resolver';
import { ArtService } from './art.service';
import { Art } from './entities/art.entity';
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
    ]),
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
