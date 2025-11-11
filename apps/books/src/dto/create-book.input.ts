import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
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
}
