import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Question {
  @Prop({ required: true, minlength: 2 })
  title: string;

  @Prop()
  desc: string;
}

// 类型定义
export type QuestionDocument = HydratedDocument<Question>;

// 导出一个可操作的实例对象
export const QuestionSchema = SchemaFactory.createForClass(Question);
