import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserConditionDocument = UserCondition & Document;

@Schema()
export class UserCondition {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  conditionId: number;

  @Prop({ default: false })
  conditionStatus: boolean;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserConditionSchema = SchemaFactory.createForClass(UserCondition);
