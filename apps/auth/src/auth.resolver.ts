import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register-user.input';
import { AuthUser } from './entities/auth-user.entity';

@Resolver(() => AuthUser)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthUser)
  async register(@Args('input') input: RegisterInput): Promise<AuthUser> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.authService.register(input);
  }
}
