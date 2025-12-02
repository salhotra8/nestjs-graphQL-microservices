import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Listen for the event emitted by Auth Service
  @EventPattern('user.registered')
  handleUserCreated(@Payload() data: any) {
    console.log('Kafka Event Received:', data);

    // Call your service to save user to the Users DB
    // this.usersService.create({
    //   email: data.email,
    //   name: data.name,
    // });
  }
}
