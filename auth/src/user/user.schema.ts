import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type Role = 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: [String], default: ['USER'] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
