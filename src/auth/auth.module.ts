import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModule, // 引入用户模块，才能使用，用户模块中的服务。而且要确保用户服务已经是被导出声明的。
    JwtModule.register({
      global: true, // 全局生效
      secret: jwtConstants.secret, // 盐
      signOptions: {
        expiresIn: '1d', // 过期时间为 1 天
      },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD, // 将我们写的守卫，声明为可提供的服务
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
