import { Body, Controller, Post, Patch, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Logger } from '@nestjs/common';
import { SignupReqDto } from './dto/signupReqDto';
import { SignupResDto } from './dto/signupResDto';
import { LoginReqDto } from './dto/loginReqDto';
import { LoginResDto } from './dto/loginResDto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  private logger = new Logger();

  @Post('signup')
  async signup(@Body() body: SignupReqDto): Promise<SignupResDto> {
    const roles = body.roles ?? ['USER'];
    const user = await this.userService.create(
      body.email,
      body.password,
      roles,
    );

    return { message: 'success sign up', email: user.email, roles: user.roles };
  }

  @Post('login')
  async login(@Body() body: LoginReqDto): Promise<LoginResDto> {
    const user = await this.authService.validateUser(body.email, body.password);

    return this.authService.login(user);
  }

  @Patch('roles/:email')
  async assignRoles(
    @Param('email') email: string,
    @Body() body: { roles: string[] },
  ) {
    const updated = await this.userService.updateRoles(email, body.roles);
    return { message: 'Roles updated', updated };
  }
}
