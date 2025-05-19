import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true, unique: true })
  rewardId: number;

  @Prop({ required: true })
  eventId: number;

  @Prop({ required: true })
  type: string;

  @Prop({ type: [Number], default: [] })
  conditionIds: number[];

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
