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
  Request,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto';
import { Public } from '../auth/decorators/public.decorator';

class RequestDto {
  readonly user: { username: string };
}

@Controller('question')
export class QuestionController {
  constructor(private readonly queryService: QuestionService) {}

  // 新增
  @Post()
  create(@Request() req: RequestDto) {
    const { username } = req.user;
    return this.queryService.create(username);
  }

  // 批量删除
  @Delete()
  deleteMany(@Body() body: { ids: string[] }, @Request() req: RequestDto) {
    const { username } = req.user;
    const { ids = [] } = body;
    return this.queryService.deleteMany(ids, username);
  }

  // 删除
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: RequestDto) {
    const { username } = req.user;
    return this.queryService.delete(id, username);
  }

  // 更新
  @Patch(':id')
  updateOne(@Param('id') id: string, @Request() req: RequestDto, @Body() questionDto: QuestionDto) {
    const { username } = req.user;
    return this.queryService.update(id, username, questionDto);
  }

  // 复制
  @Post('duplicate/:id')
  duplicate(@Param('id') id: string, @Request() req: RequestDto) {
    const { username } = req.user;
    return this.queryService.duplicate(id, username);
  }

  // 问卷第三方是没有登陆的，都是直接访问，所以不能校验 token
  @Public()
  // 查询 1 条
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryService.findOne(id);
  }

  // 批量查询
  @Get()
  async findAllList(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('isStar') isStar: boolean,
    @Query('isDeleted') isDeleted: boolean = false,
    @Request() req: RequestDto,
  ) {
    const { username: author } = req.user;

    const list = await this.queryService.findAllList({
      keyword,
      page,
      pageSize,
      isDeleted,
      isStar,
      author,
    });
    const total = await this.queryService.countAll(keyword, isDeleted, isStar, author);

    return {
      list,
      total,
    };
  }

  // 异常测试
  @Get('test')
  getMessage(): string {
    throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST);
  }
}
