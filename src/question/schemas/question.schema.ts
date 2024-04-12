import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop()
  js: string;

  @Prop()
  css: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isStar: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: true })
  author: string;

  @Prop()
  componentList: {
    fe_id: string; // 前端生成的，不是后端控制的
    type: string; // 组件类型
    title: string; // 组件标题
    isHidden: boolean; // 是否隐藏
    isLocked: boolean; // 是否锁定
    props: any; // 组件的属性
  }[];
}

// 类型定义
export type QuestionDocument = HydratedDocument<Question>;

// 导出一个可操作的实例对象
const QuestionSchema = SchemaFactory.createForClass(Question);

// 定义虚拟属性id
QuestionSchema.virtual('id').get(function () {
  // id属性将_id字段的值转换为字符串形式。
  return this._id.toHexString();
});

export { QuestionSchema };
