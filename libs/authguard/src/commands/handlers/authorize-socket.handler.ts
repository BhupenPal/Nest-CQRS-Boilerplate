import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { AuthorizeSocketCommand } from '../impl/authorize-socket.command';

@QueryHandler(AuthorizeSocketCommand)
export class AuthenticateUserHandler
  implements ICommandHandler<AuthorizeSocketCommand>
{
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async execute(command: AuthorizeSocketCommand): Promise<any> {
    const { bearerToken } = command;

    const token = bearerToken.split(' ')[1];

    const user = await this.verifyToken(token);

    if (!user) {
      throw new WsException('Invalid token passed.');
    }

    this.removeTokenFromRedis(user.id, token);

    return user;
  }

  private verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get('SOCKET_ACCESS_TOKEN_SECRET'),
    });
  }

  private removeTokenFromRedis(userId: string, token: string) {
    const redisKey = userId + ':' + token;
    return this.cacheManager.del(redisKey);
  }
}
