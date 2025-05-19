import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Headers,
  ParseIntPipe,
} from '@nestjs/common';
import { RewardRequestService } from './rewardRequest.service';

@Controller('rewardRequest')
export class RewardRequestController {
  constructor(private readonly service: RewardRequestService) {}

  @Post(':rewardId')
  async request(
    @Param('rewardId', ParseIntPipe) rewardId: number,
    @Headers('x-user-email') userEmail: string,
  ) {
    return this.service.requestReward(userEmail, rewardId);
  }

  @Get()
  async getRequestHistory(@Headers('x-user-email') userEmail: string) {
    return this.service.getMyRequests(userEmail);
  }

  @Get('monitoring')
  async monitoringRequests(
    @Query('userEmail') userEmail?: string,
    @Query('eventId') eventId?: number,
    @Query('requestStatus') requestStatus?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.monitoringRequests({
      userEmail,
      eventId,
      requestStatus,
      page,
      limit,
    });
  }
}
