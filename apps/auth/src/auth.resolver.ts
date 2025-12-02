import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { RegisterInput } from './dto/register-user.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async register(@Args('input') input: RegisterInput): Promise<Auth> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.authService.register(input);
  }
}
