import { CanActivate, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { AuthorizeSocketCommand } from '../commands/impl/authorize-socket.command';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly commandBus: CommandBus) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    if (context.args[0].user) {
      return context.args[0].user;
    }

    const decoded = this.commandBus.execute(
      new AuthorizeSocketCommand(context.args[1]),
    );

    return new Promise((resolve, reject) => {
      return decoded
        .then((user) => {
          context.args[0].user = user;
          resolve(user);
        })
        .catch(() => {
          reject(false);
        });
    });
  }
}
