import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtResolver } from './art.resolver';
import { ArtService } from './art.service';
import { Art } from './entities/art.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Art, //
    ]),
  ],
  providers: [
    ArtResolver, //
    ArtService,
  ],
})
export class ArtModule {}
