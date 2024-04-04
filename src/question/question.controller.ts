import {
  Controller,
  Get,
  HttpStatus,
  HttpException,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly queryService: QuestionService) {}

  @Post()
  create() {
    return this.queryService.create();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.queryService.delete(id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    return this.queryService.update(id, questionDto);
  }

  @Get()
  async findAllList(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const list = await this.queryService.findAllList({ keyword, page, pageSize });
    const count = await this.queryService.countAll(keyword);
    return {
      list,
      count,
    };
  }

  @Get('test')
  getMessage(): string {
    throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST);
  }
}
