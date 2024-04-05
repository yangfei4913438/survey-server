import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true, // 记录时间戳，自动添加创建时间和更新时间
})
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  nickname: string;
}

// 类型定义
export type UserDocument = HydratedDocument<User>;

// 导出一个可操作的实例对象
export const UserSchema = SchemaFactory.createForClass(User);
