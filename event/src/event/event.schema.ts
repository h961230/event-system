import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true, unique: true })
  eventId: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'INACTIVE' })
  state: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
