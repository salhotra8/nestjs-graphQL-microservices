import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { Book } from './book.entity';

@ObjectType()
@Directive('@key(fields: "name")')
@Directive('@cacheControl(maxAge: 3600)')
export class User {
  @Field(() => String, { description: 'Name of the user' })
  name: string;

  @Field(() => [Book])
  books?: Book[];
}
