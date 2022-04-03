import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1h' },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '8h' },
    );
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.daseul.shop; SameSite=None; Secure;httpOnly;`,
    );
  }

  async loginOAuth(req, res) {
    let email = req.user.email;
    let user = await this.userService.findOne(email);

    if (!user || !user.phoneNum) {
      const { password, ...rest } = req.user;
      const hashedPassword = await bcrypt.hash(String(password), 1);
      const createUser = { ...rest, password: hashedPassword };
      user = await this.userService.create({ ...createUser });
      this.setRefreshToken({ user, res });
      res.redirect('https://artipul.shop/socialLogin');
    } else {
      this.setRefreshToken({ user, res });
      res.redirect('https://artipul.shop/');
    }
  }
}
