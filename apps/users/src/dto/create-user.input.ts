import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Name of the user' })
  name: string;

  @Field(() => String, { description: 'Email address of the user' })
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  @Field(() => String, { nullable: true, description: 'Address of the user' })
  address: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  @Field(() => String, { nullable: true, description: 'Phone number of the user' })
  phone: string;

  @Field(() => String, { description: 'Whether the user is complete' })
  completionStatus: 'PENDING' | 'COMPLETE';
}
