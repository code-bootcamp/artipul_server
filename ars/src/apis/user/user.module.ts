import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtService } from '../art/art.service';
import { Art } from '../art/entities/art.entity';
import { ArtImage } from '../artImage/entities/artImage.entity';
import { Profile } from '../profile/entities/profile.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Profile,
      Art,
      ArtImage,
    ]),
  ],
  providers: [
    UserResolver, //
    UserService,
    ArtService,
  ],
})
export class UserModule {}
