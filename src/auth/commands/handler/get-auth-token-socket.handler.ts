import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetAuthTokenForSocket } from '../impl/get-auth-token-socket.command';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { JWTUserPayload } from '@app/types';

@QueryHandler(GetAuthTokenForSocket)
export class GetAuthTokenForSocketHandler
  implements ICommandHandler<GetAuthTokenForSocket>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async execute(command: GetAuthTokenForSocket): Promise<any> {
    const { user, req } = command;

    // CHECK IF ALREADY IN THE ROOM

    const socketAccessToken = await this.signSocketAccessToken(user);

    await this.storeTokenInRedis(user.id, socketAccessToken, req.ip);

    return `Bearer ${socketAccessToken}`;
  }

  private signSocketAccessToken(user: JWTUserPayload) {
    return this.jwtService.signAsync(user, {
      secret: this.configService.get('SOCKET_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('SOCKET_ACESS_TOKEN_EXPIRY'),
    });
  }

  private storeTokenInRedis(userId: string, token: string, req_ip: string) {
    const redisKey = userId + ':' + token;

    const redisValue = {
      ip: req_ip,
      tokenType: 'socket-access-token',
      timestamp: Date.now(),
    };

    return this.cacheManager.set(
      redisKey,
      redisValue,
      this.configService.get('SOCKET_ACCESS_TOKEN_EXPIRY'),
    );
  }
}
