import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Logger, ConflictException, BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  private logger = new Logger();

  async create(email: string, password: string, roles: string[]) {
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }
    const hashed = await bcrypt.hash(password, 10);
    const created = new this.userModel({ email, password: hashed, roles });
    const newUser = created.save();
    this.logger.log(JSON.stringify(newUser));
    return newUser;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async updateRoles(email: string, roles: string[]) {
    const user = await this.findByEmail(email);
    this.logger.log({ user: user });
    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자 입니다.');
    }
    return this.userModel.findByIdAndUpdate(user.id, { roles }, { new: true });
  }
}
