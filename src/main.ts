import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // 全局路由前缀

  app.useGlobalInterceptors(new TransformInterceptor()); // 全局拦截器

  app.useGlobalFilters(new HttpExceptionFilter()); // 全局过滤器

  await app.listen(3005); // 启动监听端口
}
bootstrap();
