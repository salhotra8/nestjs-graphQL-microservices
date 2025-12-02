import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { RegisterInput } from './dto/register-user.input';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly jwtService: JwtService,
    // Inject your Database Repository here (e.g., PrismaService)
  ) {}

  async onModuleInit() {
    // Connect Kafka Producer on startup
    await this.kafkaClient.connect();
  }

  async register(input: RegisterInput): Promise<any> {
    // 1. Hash Password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const hashedPassword: string = await hash(input.password, 10);

    // 2. Save to Auth DB (Pseudo-code)
    // const newAuthUser = await this.prisma.credentials.create({
    //   data: { email: input.email, password: hashedPassword }
    // });

    console.log({ email: input.email, password: hashedPassword });

    // MOCK ID for demonstration
    const newAuthUser = { id: 'user-123', email: input.email };

    // 3. EMIT EVENT TO KAFKA
    // This is the hybrid part: Async communication to Users service
    this.kafkaClient.emit('user.registered', {
      id: newAuthUser.id,
      email: newAuthUser.email,
      name: input.name, // Assuming name is passed during register
    });

    console.log('kafka event emiited');

    // 4. Generate Token
    const token = this.jwtService.sign({
      sub: newAuthUser.id,
      email: newAuthUser.email,
    });

    return {
      token,
      id: newAuthUser.id,
      email: newAuthUser.email,
      name: input.name,
    };
  }
}
