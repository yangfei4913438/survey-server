import { Module } from '@nestjs/common';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { AnswerModule } from '../answer/answer.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [AnswerModule, QuestionModule],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
