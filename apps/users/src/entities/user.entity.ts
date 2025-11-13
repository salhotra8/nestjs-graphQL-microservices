import { ObjectType, Field, Directive, ID } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "name")')
export class User {
  @Field(() => ID, {
    nullable: true,
    description: 'Unique identifier for the user',
  })
  _id: string;

  @Field(() => String, { nullable: true, description: 'Name of the user' })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Email address of the user',
  })
  email: string;

  @Field(() => String, { nullable: true, description: 'Address of the user' })
  address: string;

  @Field(() => String, {
    nullable: true,
    description: 'Phone number of the user',
  })
  phone: string;
}
