import { Body, Controller, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerDto } from './dto/answer.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Public()
  @Post()
  async create(@Body() body: AnswerDto) {
    return this.answerService.create(body);
  }
}
