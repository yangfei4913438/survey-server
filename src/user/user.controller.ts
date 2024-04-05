import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 注册
  @Public()
  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }

  // 获取用户信息
  @Get('info')
  @Redirect('/api/auth/profile', 302) // GET 请求 - 302 临时重定向，301 永久重定向
  async info() {
    return;
  }

  // 注册
  @Public()
  @Post('login')
  @Redirect('/api/auth/login', 307) // POST 请求 - 308 永久，307 临时
  async login() {
    return;
  }
}
