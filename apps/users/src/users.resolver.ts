/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Resolver, Query, Mutation, Args, Int, ResolveReference } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { User as UserSchema } from '../schema/user.schema';
import { UseInterceptors } from '@nestjs/common';
import { GraphqlInterceptor } from 'shared/graphql.interceptor';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => [User], { name: 'users' })
  @UseInterceptors(GraphqlInterceptor)
  async getAllUsers() {
    try {
      const users = await this.usersService.findAll();
      return users;
    } catch (e) {
      console.log(e);
    }
  }

  @Query(() => User, { name: 'user' })
  async getUserById(@Args('id', { type: () => Int }) id: number) {
    try {
      const user = await this.usersService.findOne(id);
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    name: string;
  }): Promise<UserSchema | null> {
    try {
      const user = await this.usersService.findUserByName(reference.name);
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
