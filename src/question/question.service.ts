import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { Model } from 'mongoose';
import { QuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionService {
  constructor(
    // 依赖注入
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async create(): Promise<Question> {
    const question = new this.questionModel({
      title: '默认标题 ' + new Date().toLocaleString(),
      desc: '默认描述',
    });
    return question.save();
  }

  async findOne(id: string): Promise<Question> {
    return this.questionModel.findById(id);
  }

  async findAllList({ keyword = '', page = 1, pageSize = 10 }): Promise<Question[]> {
    const whereOpt: any = {};
    if (keyword) {
      const reg = new RegExp(keyword, 'i'); // 不区分大小写
      whereOpt.title = { $regex: reg }; // 模糊搜索
    }

    return this.questionModel
      .find(whereOpt)
      .sort({ _id: -1 }) // 倒序排序
      .skip((page - 1) * pageSize) // 分页，跳过前多少条
      .limit(pageSize);
  }

  async countAll(keyword: string = '') {
    const whereOpt: any = {};
    if (keyword) {
      const reg = new RegExp(keyword, 'i'); // 不区分大小写
      whereOpt.title = { $regex: reg }; // 模糊搜索
    }
    // 统计数量
    return this.questionModel.countDocuments(whereOpt);
  }

  async update(id: string, updateData: QuestionDto) {
    return this.questionModel.updateOne({ _id: id }, updateData);
  }

  async delete(id: string): Promise<Question> {
    return this.questionModel.findByIdAndDelete(id);
  }
}
