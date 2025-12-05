import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  completionStatus: 'PENDING' | 'COMPLETED';
}

export const UserSchema = SchemaFactory.createForClass(User);
