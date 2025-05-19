import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger();

  async validateUser(email: string, password: string) {
    const signedUser = await this.userService.validateUser(email, password);
    this.logger.log({ signedUser: signedUser });
    if (!signedUser) {
      throw new BadRequestException('존재하지 않는 email 입니다.');
    }
    return signedUser;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
