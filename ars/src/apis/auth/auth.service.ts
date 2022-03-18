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
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );

    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }

  async loginOAuth(req, res) {
    let user = await this.userService.findOne({ email: req.user.email });

    if (!user) {
      const { password, ...rest } = req.user;
      console.log(password, '비밀번호');
      const hashedPassword = await bcrypt.hash(String(password), 1);
      const createUser = { ...rest, password: hashedPassword };
      user = await this.userService.create({ ...createUser });
    }

    this.setRefreshToken({ user, res });
    res.redirect('http://localhost:5500/frontend/login/index.html');
  }
}
