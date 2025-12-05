import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { RegisterInput } from './dto/register-user.input';
import { Model } from 'mongoose';
import { AuthUser } from './entities/auth-user.entity';
import { UserCredentials } from './schema/user-credential.schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    @InjectModel(UserCredentials.name)
    private UserCredentialModel: Model<UserCredentials>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // Connect Kafka Producer on startup
    await this.kafkaClient.connect();
  }

  async register(input: RegisterInput): Promise<AuthUser> {
    // 1. Hash Password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const hashedPassword: string = await hash(input.password, 12);

    // 2. Save to Auth DB (Pseudo-code)
    const newUserCredential = await this.UserCredentialModel.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    const newAuthUser = {
      _id: newUserCredential._id as string,
      email: newUserCredential.email,
      name: newUserCredential.name,
    };

    // 3. EMIT EVENT TO KAFKA
    const kafkaTopic = 'user.registered';
    this.kafkaClient.emit(kafkaTopic, newAuthUser);

    console.log(`${kafkaTopic} emitted`);

    // 4. Generate Token
    const token = this.jwtService.sign(newAuthUser);

    return {
      token: token,
      user: newAuthUser,
    };
  }
}
