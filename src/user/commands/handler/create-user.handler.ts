import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PrimaryDB } from 'src/prisma/primary.service';
import { UserCreatedEvent } from 'src/user/events/impl/user-created.event';
import { CreateUserCommand } from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly primaryDB: PrimaryDB,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { givenName, familyName, email, password } = command;

    const user = await this.primaryDB.user.create({
      data: {
        email: email,
        givenName: givenName,
        familyName: familyName,
        password: password,
        userName: '',
      },
    });

    if (!user) {
      console.log('Error creating user');
    }

    this.eventBus.publish(new UserCreatedEvent(user.id));
  }
}
