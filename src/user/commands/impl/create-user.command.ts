import { ICommand } from '@nestjs/cqrs';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly givenName: string,
    public readonly familyName: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
