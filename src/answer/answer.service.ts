import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { Model } from 'mongoose';
import { AnswerDto } from './dto/answer.dto';

@Injectable()
export class AnswerService {
  constructor(@InjectModel(Answer.name) private readonly answerModel: Model<AnswerDocument>) {}

  // 创建答卷
  async create(answerInfo: AnswerDto) {
    if (answerInfo.questionId === null) {
      throw new HttpException('缺少问卷 ID', HttpStatus.BAD_REQUEST);
    }
    const answer = new this.answerModel(answerInfo);
    return await answer.save();
  }
}
