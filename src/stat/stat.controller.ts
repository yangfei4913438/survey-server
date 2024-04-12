import { Controller, Get, Param } from '@nestjs/common';
import { StatService } from './stat.service';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get(':questionID')
  async getQuestion(
    @Param('questionID') questionID: string,
    @Param('page') page: number = 1,
    @Param('pageSize') pageSize: number = 10,
  ) {
    return this.statService.getQuestionStatListCount(questionID, { page, pageSize });
  }

  @Get(':questionId/:componentFeId')
  async getComponentStat(
    @Param('questionId') questionId: string,
    @Param('componentFeId') componentFeId: string,
  ) {
    const stat = await this.statService.getComponentStat(questionId, componentFeId);
    return { stat };
  }
}
