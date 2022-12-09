import { EventBus, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { PrimaryDB } from '@app/database';
import { UserCreatedEvent } from 'src/user/events/impl/user-created.event';
import { AuthenticateUserQuery } from '../impl/authenticate-user.query';

@QueryHandler(AuthenticateUserQuery)
export class AuthenticateUserHandler
  implements ICommandHandler<AuthenticateUserQuery>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly primaryDB: PrimaryDB,
  ) {}

  async execute(command: AuthenticateUserQuery): Promise<any> {
    const { email, password } = command;

    const user = await this.primaryDB.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user) {
      console.log('User not found');
    }

    this.eventBus.publish(new UserCreatedEvent(user.id));
  }
}
