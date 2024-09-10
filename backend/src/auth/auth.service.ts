import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from 'src/helpers/hash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({
      select: { username: true, password: true, id: true },
      where: { username },
    });

    if (user && (await verifyHash(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne({ where: { username } });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(user) {
    const { username, id: sub } = user;

    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }
}
