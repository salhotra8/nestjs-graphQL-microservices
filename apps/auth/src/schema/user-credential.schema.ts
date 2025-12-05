import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserCredentials extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // Store HASHED password here

  @Prop({ required: true })
  name: string;
}

export const UserCredentialSchema = SchemaFactory.createForClass(UserCredentials);
