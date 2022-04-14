import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { CreateProfileInput } from './dto/createProfileInput';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Profile)
  async fetchProfile(@CurrentUser() currentUser: ICurrentUser) {
    return await this.profileService.findOne(currentUser.id);
  }

  @Query(() => Profile)
  async fetchArtistProfile(@Args('artId') artId: string) {
    return await this.profileService.findArtistFromArt(artId);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Profile)
  async createProfile(
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.profileService.create(
      { ...createProfileInput },
      currentUser,
    );
  }
}
