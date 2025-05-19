import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

@Schema()
export class RewardRequest {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  rewardId: number;

  @Prop({ required: true })
  eventId: number;

  @Prop({ enum: ['SUCCESS', 'FAILURE'], default: 'FAILURE' })
  requestStatus: string;

  @Prop()
  reason?: string;

  @Prop({ default: Date.now })
  requestedAt: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
