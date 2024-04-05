import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import mongoose, { Model } from 'mongoose';
import { QuestionDto } from './dto/question.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class QuestionService {
  constructor(
    // 依赖注入
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDocument>,
  ) {}

  // 新增数据
  async create(username: string): Promise<Question> {
    const question = new this.questionModel({
      title: '问卷标题 ' + new Date().toLocaleString(),
      desc: '问卷描述',
      author: username,
      isPublished: false,
      isStar: false,
      isDeleted: false,
      componentList: [
        {
          fe_id: nanoid(),
          type: 'questionInfo',
          title: '问卷信息',
          props: { title: '问卷标题', desc: '问卷描述...' },
        },
      ],
    });
    return question.save();
  }

  // 删除数据
  async delete(id: string, author: string): Promise<Question> {
    // 只能删自己的数据
    return this.questionModel.findOneAndDelete({
      _id: id,
      author,
    });
  }

  // 批量删除
  async deleteMany(ids: string[], author: string) {
    return this.questionModel.deleteMany({
      _id: { $in: ids },
      author,
    });
  }

  // 修改数据
  async update(id: string, author: string, updateData: QuestionDto) {
    return this.questionModel.updateOne({ _id: id, author }, updateData);
  }

  async duplicate(id: string, author: string) {
    // 创建ObjectId
    const objectId = new mongoose.Types.ObjectId(id);
    // 查询是否存在
    const doesExist = await this.questionModel.exists({ _id: objectId });
    if (!doesExist) {
      throw new HttpException('不存在的问卷', HttpStatus.UNAUTHORIZED);
    }
    // 找到问卷
    const question = await this.questionModel.findById(id);
    const newQuestion = new this.questionModel({
      ...question.toObject(),
      _id: new mongoose.Types.ObjectId(), // 生成一个新的 MongoDB object id
      title: question.title + '_副本',
      author,
      isPublished: false,
      isStar: false,
      isDeleted: false,
      componentList: question.componentList.map((item) => {
        return {
          ...item,
          fe_id: nanoid(), // 重置 fe_id
        };
      }),
    });
    return await newQuestion.save();
  }

  // 查询数据
  async findOne(id: string): Promise<Question> {
    return this.questionModel.findById(id);
  }

  // 批量查询
  async findAllList({
    keyword = '',
    page = 1,
    pageSize = 10,
    isDeleted = false,
    isStar,
    author = '',
  }): Promise<Question[]> {
    const whereOpt: any = {
      author,
      isDeleted,
    };
    if (isStar !== undefined) {
      whereOpt.isStar = isStar;
    }
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

  // 统计数据
  async countAll(keyword: string = '', isDeleted = false, isStar, author = '') {
    const whereOpt: any = {
      author,
      isDeleted,
    };
    if (isStar !== undefined) {
      whereOpt.isStar = isStar;
    }
    if (keyword) {
      const reg = new RegExp(keyword, 'i'); // 不区分大小写
      whereOpt.title = { $regex: reg }; // 模糊搜索
    }
    // 统计数量
    return this.questionModel.countDocuments(whereOpt);
  }
}
