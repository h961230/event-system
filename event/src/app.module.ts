import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { Event, EventSchema } from './event/event.schema';

import {
  UserCondition,
  UserConditionSchema,
} from './condition/userCondition.schema';
import { UserConditionController } from './condition/userCondition.controller';
import { UserConditionService } from './condition/userCondition.service';

import { Reward, RewardSchema } from './reward/reward.schema';
import { RewardController } from './reward/reward.controller';
import { RewardService } from './reward/reward.service';

import {
  RewardRequest,
  RewardRequestSchema,
} from './rewardRequest/rewardRequest.schema';
import { RewardRequestController } from './rewardRequest/rewardRequest.controller';
import { RewardRequestService } from './rewardRequest/rewardRequest.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: UserCondition.name, schema: UserConditionSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
  ],
  controllers: [
    EventController,
    UserConditionController,
    RewardController,
    RewardRequestController,
  ],
  providers: [
    EventService,
    UserConditionService,
    RewardService,
    RewardRequestService,
  ],
})
export class AppModule {}
