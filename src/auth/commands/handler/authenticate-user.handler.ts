import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { PrimaryDB } from '@app/database';
import { AuthenticateUserCommand } from '../impl/authenticate-user.command';
import { argon2id, verify } from 'argon2';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(AuthenticateUserCommand)
export class AuthenticateUserHandler
  implements ICommandHandler<AuthenticateUserCommand>
{
  constructor(private readonly primaryDB: PrimaryDB) {}

  public async execute(command: AuthenticateUserCommand): Promise<any> {
    const { email, password } = command;

    const user = await this.primaryDB.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        familyName: true,
        givenName: true,
        userName: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password.');
    }

    const isIncorrectPassword = await this.verifyPasword(
      user.password,
      password,
    );

    if (isIncorrectPassword) {
      throw new BadRequestException('Invalid email or password.');
    }

    return {
      id: user.id,
      familyName: user.familyName,
      giveName: user.givenName,
      userName: user.userName,
      role: user.role,
    };
  }

  private verifyPasword(hashedPassword: string, plainPassword: string) {
    return verify(hashedPassword, plainPassword, { type: argon2id });
  }
}
