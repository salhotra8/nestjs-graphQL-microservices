import { Injectable } from '@nestjs/common';
import { User } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userSchema: Model<User>) {}

  create(createUserInput: User): Promise<User> {
    return this.userSchema.create(createUserInput);
  }

  findAll(): Promise<User[]> {
    return this.userSchema.find({});
  }

  findOne(id: number): Promise<User[] | null> {
    return this.userSchema.findById(id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findUserByName(name: string): Promise<User | null> {
    return this.userSchema.findOne({ name });
  }
}
