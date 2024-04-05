import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() userInfo: AuthDto) {
    const { username, password } = userInfo;
    return this.authService.login(username, password);
  }

  @Get('profile')
  async getProfile(@Request() req: { user: { username: string } }) {
    return req.user;
  }
}
