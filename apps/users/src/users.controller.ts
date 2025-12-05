import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { ObjectId } from 'mongoose';

class UserRegisteredEvent {
  _id: ObjectId;
  name: string;
  email: string;
}

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Listen for the event emitted by Auth Service
  @EventPattern('user.registered')
  async handleUserCreated(@Payload() data: UserRegisteredEvent) {
    console.log('Kafka Event Received:', data);

    // Call your service to save user to the Users DB
    return await this.usersService.create({ ...data, completionStatus: 'PENDING' });
  }
}
