import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCondition, UserConditionDocument } from './userCondition.schema';
import { CreateUserConditionReqDto } from './dto/createUserConditionReq.dto';

@Injectable()
export class UserConditionService {
  constructor(
    @InjectModel(UserCondition.name)
    private readonly model: Model<UserConditionDocument>,
  ) {}

  async createUserCondition(dto: CreateUserConditionReqDto) {
    return this.model.create(dto);
  }

  async getUserConditions(userEmail: string) {
    return this.model.find({ userEmail });
  }

  async getCompletedConditionsByUserEmail(
    userEmail: string,
    conditionIds: number[],
  ) {
    return this.model.find({
      userEmail,
      conditionId: { $in: conditionIds },
      conditionStatus: true,
    });
  }
}
