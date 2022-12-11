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
    const { user, res } = command;

    const userTokenPayload: JWTUserPayload = {
      id: user.id,
      givenName: user.givenName,
      familyName: user.familyName,
      avatar: user.avatar,
      role: user.role,
      userName: user.userName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(userTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: 60,
      }),
      this.jwtService.signAsync(userTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_REFRESH_SECRET'),
        expiresIn: 60,
      }),
    ]);

    // @TODO: ENHANCE THIS LOGIC
    const redisKeyPattern = user.id + ':' + refreshToken;

    await this.cacheManager.set(
      redisKeyPattern,
      Date.now(),
      this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRE_IN') * 60, // CONVERTING TO SECONDS
    );

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
