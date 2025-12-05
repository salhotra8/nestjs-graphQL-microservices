import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserDetails {
  @Field(() => ID, { description: 'id of the user' })
  _id: string;

  @Field(() => String, { description: 'email of the user' })
  email: string;

  @Field(() => String, { description: 'name of the user' })
  name: string;
}

@ObjectType()
export class AuthUser {
  @Field(() => String, { description: 'token of the user' })
  token: string;

  @Field(() => UserDetails, { description: 'details of user' })
  user: UserDetails;
}
