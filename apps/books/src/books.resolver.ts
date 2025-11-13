import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { GraphQLError } from 'graphql';
import { User } from './entities/user.entity';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'books' })
  async findAll() {
    try {
      const books = await this.booksService.findAll();
      return books;
    } catch (e) {
      return new GraphQLError(e);
    }
  }

  @Query(() => Book, { name: 'book' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      const book = await this.booksService.findOne(id);
      return book;
    } catch (e) {
      return new GraphQLError(JSON.stringify(e));
    }
  }

  @Mutation(() => Book)
  removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.remove(id);
  }

  @ResolveField(() => User, { nullable: true })
  user(@Parent() book: Book): any {
    if (!book.author) {
      return null;
    }
    return { __typename: 'User', _id: book.author, name: book.author };
  }
}
