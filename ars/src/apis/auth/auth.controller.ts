import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

interface IOAuthUser {
  user: Partial<User>;
}

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async checkUser(req) {
    let user = await this.userService.findOAuthUser({ email: req.user.email });

    if (!user) {
      const { password, ...rest } = req.user;
      const createUser = { ...rest, hashedPassword: password };
      user = await this.userService.create({ ...createUser });
    }

    return user;
  }

  @Get('/login/google/callback')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    // const user = this.checkUser(req);

    // this.authService.setRefreshToken({ user, res });

    // res.redirect('http://localhost:5500/frontend/login/index.html');
    console.log(req.res);
  }

  @Get('/login/naver/callback')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    const user = this.checkUser(req);

    this.authService.setRefreshToken({ user, res });

    res.redirect(
      'http://localhost:5500/main-project/frontend/login/index.html',
    );
  }

  @Get('/login/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    const user = this.checkUser(req);

    this.authService.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5500/main-project/frontend/login/index.html',
    );
  }
}
