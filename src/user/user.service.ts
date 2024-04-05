import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  // 创建用户
  async create(userData: UserDto) {
    const userCheck = this.userModel.findOne({ username: userData.username });
    if (!userCheck) {
      const user = new this.userModel(userData);
      return user.save();
    }
    throw new HttpException('已存在的用户名', HttpStatus.UNAUTHORIZED);
  }

  // 查询用户
  async findOne(username: string, password: string) {
    return this.userModel.findOne({ username, password });
  }
}
