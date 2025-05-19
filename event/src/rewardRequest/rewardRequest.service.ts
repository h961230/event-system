import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RewardRequest, RewardRequestDocument } from './rewardRequest.schema';
import { Reward, RewardDocument } from '../reward/reward.schema';
import {
  UserCondition,
  UserConditionDocument,
} from '../condition/userCondition.schema';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    @InjectModel(Reward.name)
    private rewardModel: Model<RewardDocument>,
    @InjectModel(UserCondition.name)
    private userConditionModel: Model<UserConditionDocument>,
  ) {}
  private logger = new Logger();

  async requestReward(userEmail: string, rewardId: number) {
    const rewardRequestInfo = await this.rewardRequestModel.exists({
      userEmail,
      rewardId,
      requestStatus: 'SUCCESS',
    });
    this.logger.log({ rewardRequestInfo: rewardRequestInfo });
    if (rewardRequestInfo) {
      throw new BadRequestException('이미 해당 보상을 지급하였습니다.');
    }

    const reward = await this.rewardModel.findOne({ rewardId });
    if (!reward) {
      throw new BadRequestException('보상이 존재하지 않습니다.');
    }

    const requiredConditions = reward.conditionIds ?? [];

    const allConditions = await this.userConditionModel.find({
      userEmail,
      conditionId: { $in: requiredConditions },
    });

    const fulfilledConditionIds = allConditions
      .filter((c) => c.conditionStatus === true)
      .map((c) => c.conditionId);

    const unfulfilledConditionIds = requiredConditions.filter(
      (id) => !fulfilledConditionIds.includes(id),
    );

    this.logger.log({ allConditions: allConditions });
    this.logger.log({ fulfilledConditionIds: fulfilledConditionIds });
    this.logger.log({ unfulfilledConditionIds: unfulfilledConditionIds });

    const success = unfulfilledConditionIds.length === 0;

    const rewardRequestHist = await this.rewardRequestModel.findOne({
      userEmail,
      rewardId,
    });

    const updateData = {
      eventId: reward.eventId,
      requestStatus: success ? 'SUCCESS' : 'FAILURE',
      reason: success
        ? ''
        : `조건 미충족 condition ids : [${unfulfilledConditionIds.join(', ')}]`,
      requestedAt: new Date(),
    };

    if (rewardRequestHist) {
      return this.rewardRequestModel.findByIdAndUpdate(
        rewardRequestHist.id,
        updateData,
        { new: true },
      );
    }

    return this.rewardRequestModel.create({
      userEmail,
      rewardId,
      ...updateData,
    });
  }

  async getMyRequests(userEmail: string) {
    return this.rewardRequestModel.find({ userEmail });
  }

  async monitoringRequests(filter: {
    userEmail?: string;
    eventId?: number;
    requestStatus?: string;
    page?: number;
    limit?: number;
  }) {
    const query: any = {};
    if (filter.userEmail) query.userId = filter.userEmail;
    if (filter.eventId) query.eventId = filter.eventId;
    if (filter.requestStatus) query.requestStatus = filter.requestStatus;

    this.logger.log({ q: query });

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.rewardRequestModel.countDocuments(query),
      this.rewardRequestModel
        .find(query)
        .sort({ requestedAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }
}
