import { Injectable } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { Book } from './schema/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  create(createBookInput: CreateBookInput) {
    console.log(createBookInput);
    return 'This action adds a new book';
  }

  findAll(): Promise<Book[]> {
    return this.bookModel.find({});
  }

  findOne(id: string): Promise<Book | null> {
    return this.bookModel.findById(id);
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }

  findAllByAuthorName(authorName: string): Promise<Book[]> {
    return this.bookModel.find({ author: authorName });
  }
}
