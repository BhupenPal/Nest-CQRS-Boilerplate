import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/user/entities/user';
import { CreateUserCommand } from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  async execute(command: CreateUserCommand): Promise<any> {
    const user = new User();
    console.log(command);
    return '';
  }
}
