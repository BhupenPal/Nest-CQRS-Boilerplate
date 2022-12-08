export class CreateUserCommand {
  constructor(
    public readonly givenName: string,
    public readonly familyName: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
