import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardReqDto } from './dto/createRewardReqDto';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post('detail')
  async create(@Body() dto: CreateRewardReqDto) {
    return this.rewardService.create(dto);
  }

  @Get('detail')
  async findByEvent(@Query('eventId') eventId: number) {
    return this.rewardService.findByEventId(eventId);
  }
}
