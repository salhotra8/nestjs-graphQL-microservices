import { ObjectType, Field, Int, Directive, ID } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "_id")')
export class Book {
  @Field(() => ID, { description: 'Unique identifier for the book' })
  _id: string;

  @Field(() => String, { description: 'Title of the book' })
  title: string;

  @Field(() => String, { description: 'Author of the book' })
  author: string;

  @Field(() => Int, { description: 'Publication year of the book' })
  publicationYear: number;
  @Field(() => String, { description: 'Genre of the book' })
  genre: string;

  @Field(() => String, { description: 'ISBN of the book' })
  isbn: string;

  @Field(() => String, { description: 'Image URL of the book cover' })
  imageUrl: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
