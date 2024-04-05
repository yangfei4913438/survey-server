import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

class List {
  componentFeId: string; // 对应组件的 fe_id
  value: string[]; // 多选的值
}

@Schema({
  timestamps: true, // 记录时间戳，自动添加创建时间和更新时间
  toJSON: {
    virtuals: true, // 这个设置确保在将 Mongoose 文档转换为 JSON 格式时，所有的虚拟属性也会被包括在内。
    versionKey: false, // 在转换为JSON时，不包括__v字段
    transform: (doc, ret) => {
      // doc是原始的Mongoose文档，ret是即将发送给客户端的JSON对象。
      // 在这个函数中，我们删除了ret对象的_id属性，这样客户端就不会接收到这个字段。
      delete ret._id;
    },
  },
})
export class Answer {
  // 问卷 ID
  @Prop({ required: true })
  questionId: string; // 对应问卷的 _id

  @Prop()
  answerList: List;
}

// 类型定义
export type AnswerDocument = HydratedDocument<Answer>;

// 导出一个可操作的实例对象
const AnswerSchema = SchemaFactory.createForClass(Answer);

// 定义虚拟属性id
AnswerSchema.virtual('id').get(function () {
  // id属性将_id字段的值转换为字符串形式。
  return this._id.toHexString();
});

export { AnswerSchema };
