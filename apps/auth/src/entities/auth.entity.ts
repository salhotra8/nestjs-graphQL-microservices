import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field(() => String, { description: 'email of the user' })
  email: string;

  @Field(() => String, { description: 'name of the user' })
  name: string;

  @Field(() => String, { nullable: true, description: 'password of the user' })
  password: string;

  @Field(() => String, { description: 'token of the user' })
  token: string;
}
