import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { FileService } from '../file/file.service';
import { ArtResolver } from './art.resolver';
import { ArtService } from './art.service';
import { Art } from './entities/art.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Art, //
      ArtImage,
    ]),
  ],
  providers: [
    ArtResolver, //
    ArtService,
    FileService,
  ],
})
export class ArtModule {}
