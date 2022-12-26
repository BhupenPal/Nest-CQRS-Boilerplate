import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieSerializeOptions } from '@fastify/csrf-protection';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { JWTUserPayload } from '@app/types';
import { SetAuthTokenCommand } from '../impl/set-auth-token.command';

@QueryHandler(SetAuthTokenCommand)
export class SetAuthTokenHandler
  implements ICommandHandler<SetAuthTokenCommand>
{
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(command: SetAuthTokenCommand): Promise<JWTUserPayload> {
    const { user, req, res } = command;

    const userTokenPayload: JWTUserPayload = {
      id: user.id,
      givenName: user.givenName,
      familyName: user.familyName,
      avatar: user.avatar,
      role: user.role,
      userName: user.userName,
    };

    const [accessToken, refreshToken] = await this.signAccessRefreshToken(
      userTokenPayload,
    );

    await this.setRefreshTokenInRedis(user, refreshToken, req.ip);

    res.setCookie(
      'access_token',
      `Bearer ${accessToken}`,
      this.accessTokenCookieConfig,
    );

    res.setCookie(
      'refresh_token',
      `Bearer ${refreshToken}`,
      this.refreshTokenCookieConfig,
    );

    return userTokenPayload;
  }

  private signAccessRefreshToken(userTokenPayload: JWTUserPayload) {
    return Promise.all([
      this.jwtService.signAsync(userTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: 60,
      }),
      this.jwtService.signAsync(userTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_REFRESH_SECRET'),
        expiresIn: 60,
      }),
    ]);
  }

  private setRefreshTokenInRedis(
    user: JWTUserPayload,
    refreshToken: string,
    req_ip: string,
  ) {
    const redisKey = user.id + ':' + refreshToken;

    const redisValue = {
      ...user,
      ip: req_ip,
      type: 'auth-refresh-token',
      timestamp: Date.now(),
    };

    return this.cacheManager.set(
      redisKey,
      redisValue,
      this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRE_IN') * 60, // CONVERTING TO SECONDS
    );
  }

  private readonly secureCookieConfig: CookieSerializeOptions = {
    domain:
      this.configService.get<string>('NODE_ENV') === 'development'
        ? '.' + this.configService.get<string>('DOMAIN_NAME')
        : null,
    httpOnly: true,
    path: '/',
    sameSite: this.configService.get<string>('NODE_ENV') !== 'development',
    secure: this.configService.get<string>('NODE_ENV') !== 'development',
  };

  private readonly accessTokenCookieConfig: CookieSerializeOptions = {
    ...this.secureCookieConfig,
    maxAge:
      this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRE_IN') * 60000, // CONVERTING TO MILLISECOND
  };

  private readonly refreshTokenCookieConfig: CookieSerializeOptions = {
    ...this.secureCookieConfig,
    maxAge:
      this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRE_IN') * 60000, // CONVERTING TO MILLISECOND
  };
}
