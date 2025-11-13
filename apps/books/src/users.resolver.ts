import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private booksService: BooksService) {}
  @ResolveField(() => [Book])
  async books(@Parent() user: User): Promise<Book[]> {
    try {
      const books = await this.booksService.findAllByAuthorName(user.name);
      return books as Book[];
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
