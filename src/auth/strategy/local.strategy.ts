import { JWTUserPayload } from '@app/types';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

// PASSPORT
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

// COMMAND
import { AuthenticateUserCommand } from '../commands/impl/authenticate-user.command';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  'LOCAL_STRATEGY',
) {
  constructor(private readonly commandBus: CommandBus) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  validate(email: string, password: string): Promise<JWTUserPayload> {
    return this.commandBus.execute(
      new AuthenticateUserCommand(email, password),
    );
  }
}
