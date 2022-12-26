import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus) {}

  public createUser({
    givenName,
    familyName,
    email,
    password,
  }: {
    givenName: string;
    familyName: string;
    email: string;
    password: string;
  }) {
    return this.commandBus.execute(
      new CreateUserCommand(givenName, familyName, email, password),
    );
  }
}
