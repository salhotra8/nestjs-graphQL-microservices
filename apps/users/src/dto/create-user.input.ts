import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Name of the user' })
  name: string;

  @Field(() => String, { description: 'Email address of the user' })
  email: string;

  @Field(() => String, { description: 'Address of the user' })
  address: string;

  @Field(() => String, { description: 'Phone number of the user' })
  phone: string;
}
