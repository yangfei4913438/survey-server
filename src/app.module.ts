import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

// 定义 uri
const mongoURI = () => {
  // 因为配置文件功能，还没注册，所以要写成函数，等配置文件模块注册之后，再读取配置，才不会出问题。
  return `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
};

@Module({
  imports: [
    // 配置文件的默认地址 .env 不需要显示引入。
    ConfigModule.forRoot({
      isGlobal: true, // 注册为全局模块
    }),
    QuestionModule,
    MongooseModule.forRoot(mongoURI()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
