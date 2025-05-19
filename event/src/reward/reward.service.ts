import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from './reward.schema';
import { Model } from 'mongoose';
import { CreateRewardReqDto } from './dto/createRewardReqDto';
import { EventDocument } from 'src/event/event.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}
  private logger = new Logger();

  async create(dto: CreateRewardReqDto) {
    const rewardId = dto.rewardId;
    const existing = await this.rewardModel.findOne({ rewardId });
    if (existing) {
      throw new ConflictException('이미 등록된 보상 Id 입니다.');
    }
    return this.rewardModel.create(dto);
  }

  async findByEventId(eventId: number) {
    const eventInfo = await this.eventModel.exists({ eventId });
    if (!eventInfo) {
      throw new ConflictException('유효하지 않는 이벤트 입니다.');
    }
    const eventRewardInfos = await this.rewardModel.findOne({ eventId });
    this.logger.log({ eventRewardInfos: eventRewardInfos });
    if (!eventRewardInfos) {
      throw new ConflictException('보상이 등록되지 않은 이벤트 입니다.');
    }
    return eventRewardInfos;
  }
}
