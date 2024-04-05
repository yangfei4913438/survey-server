import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 依赖注入
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    try {
      const user = await this.userService.findOne(username, password);
      if (!user) {
        throw new UnauthorizedException('用户名或密码错误');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: discardedPassword, ...userInfo } = user.toObject();

      return {
        // 使用 JwtService 生成一个 token, 返回给用户
        token: this.jwtService.sign(userInfo),
        user: userInfo,
      };
    } catch (err) {
      console.error('登录失败:', err);
      throw new UnauthorizedException('登录失败，请稍后再试');
    }
  }
}
