import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  publicationYear: number;

  @Prop({ required: true })
  genre: string;

  @Prop({ required: true })
  isbn: string;

  @Prop({ required: true })
  imageUrl: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
