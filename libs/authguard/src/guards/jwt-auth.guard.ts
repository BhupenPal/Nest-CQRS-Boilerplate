/* eslint-disable @typescript-eslint/ban-ts-comment */

import { FastifyReply, FastifyRequest } from '@app/types';
import {
  CACHE_MANAGER,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';
// import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class JWTAuthGuard extends AuthGuard('JWT_ACCESS') {
  constructor(
    // private readonly helperService: HelperService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super();
  }

  // @ts-ignore
  async handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest() as FastifyRequest;

    const BearerToken = req.cookies['refresh_token'];

    if (!BearerToken || !req.cookies['access_token']) {
      throw new UnauthorizedException();
    }

    if (err || info || !user) {
      const res = context.switchToHttp().getResponse() as FastifyReply;

      //   res.clearCookie(
      //     'access_token',
      //     this.helperService.accessTokenCookieSettings,
      //   );

      throw new UnauthorizedException();
    }

    const Token = BearerToken.split(' ')[1];
    const userRedisKey = user.sub + ':' + Token;

    const isValidRedisKey = await this.cacheManager.get(userRedisKey);

    if (!isValidRedisKey) {
      const res = context.switchToHttp().getResponse() as FastifyReply;

      //   res.clearCookie(
      //     'access_token',
      //     this.helperService.accessTokenCookieSettings,
      //   );

      //   res.clearCookie(
      //     'refresh_token',
      //     this.helperService.refreshTokenCookieSettings,
      //   );

      throw new UnauthorizedException();
    }

    return user;
  }
}

@Injectable()
export class JWTLooseAuthGuard extends AuthGuard('JWT_LOOSE_ACCESS') {
  constructor(
    // private readonly helperService: HelperService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super();
  }

  // @ts-ignore
  async handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    if (!user) {
      return null;
    }

    const req = context.switchToHttp().getRequest() as FastifyRequest;

    const BearerToken = req.cookies['refresh_token'];

    if (!BearerToken || !req.cookies['access_token']) {
      throw new UnauthorizedException();
    }

    if (err || info || !user) {
      const res = context.switchToHttp().getResponse() as FastifyReply;

      //   res.clearCookie(
      //     'access_token',
      //     this.helperService.accessTokenCookieSettings,
      //   );

      throw new UnauthorizedException();
    }

    const Token = BearerToken.split(' ')[1];
    const userRedisKey = user.sub + ':' + Token;

    const isValidRedisKey = await this.cacheManager.get(userRedisKey);

    if (!isValidRedisKey) {
      const res = context.switchToHttp().getResponse() as FastifyReply;

      //   res.clearCookie(
      //     'access_token',
      //     this.helperService.accessTokenCookieSettings,
      //   );

      //   res.clearCookie(
      //     'refresh_token',
      //     this.helperService.refreshTokenCookieSettings,
      //   );

      throw new UnauthorizedException();
    }

    return user;
  }
}

@Injectable()
export class JWTRefreshAuthGuard extends AuthGuard('JWT_REFRESH') {
  constructor(
    // private readonly helperService: HelperService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super();
  }

  // @ts-ignore
  async handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest() as FastifyRequest;

    const BearerToken = req.cookies['refresh_token'];

    if (!BearerToken) {
      throw new UnauthorizedException();
    }

    if (err || info || !user) {
      const res = context.switchToHttp().getResponse() as FastifyReply;

      //   res.clearCookie(
      //     'access_token',
      //     this.helperService.accessTokenCookieSettings,
      //   );

      //   res.clearCookie(
      //     'refresh_token',
      //     this.helperService.refreshTokenCookieSettings,
      //   );

      throw new UnauthorizedException();
    }

    const Token = BearerToken.split(' ')[1];
    const userRedisKey = user.sub + ':' + Token;

    const isValidRedisKey = await this.cacheManager.get(userRedisKey);

    if (!isValidRedisKey) {
      const res = context.switchToHttp().getResponse() as FastifyReply;

      //   res.clearCookie(
      //     'access_token',
      //     this.helperService.accessTokenCookieSettings,
      //   );

      //   res.clearCookie(
      //     'refresh_token',
      //     this.helperService.refreshTokenCookieSettings,
      //   );

      throw new UnauthorizedException();
    }

    return user;
  }
}
