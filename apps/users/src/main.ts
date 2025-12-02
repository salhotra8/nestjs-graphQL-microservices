import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'users-consumer', // Unique group for this service
      },
    },
  });

  // 3. Start both HTTP and Microservice listeners
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
