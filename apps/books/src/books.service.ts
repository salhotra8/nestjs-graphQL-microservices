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

  async findAll() {
    return await this.bookModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
