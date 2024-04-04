import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';

// 捕获异常
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message ? exception.message : '服务器错误';

    response.status(status).json({
      errno: -1, // 错误码
      message, // 消息
      path: request.url, // 请求 url 地址
      timestamp: new Date().toISOString(), // 时间戳
    });
  }
}
