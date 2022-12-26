import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { AuthTokenCommandHandler } from './commands/handlers';
import {
  JWTAuthGuard,
  JWTLooseAuthGuard,
  JWTRefreshAuthGuard,
} from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RecaptchaAuthGuard } from './guards/recaptcha.guard';
import { WsGuard } from './guards/ws-auth.guard';

const setAuthTokenCQRS = [...AuthTokenCommandHandler];

const authGuards = [
  JWTAuthGuard,
  JWTLooseAuthGuard,
  JWTRefreshAuthGuard,
  LocalAuthGuard,
  RecaptchaAuthGuard,
  WsGuard,
];

@Global()
@Module({
  imports: [HttpModule],
  providers: [...authGuards, ...setAuthTokenCQRS],
  exports: [...authGuards, ...setAuthTokenCQRS],
})
export class AuthGuardModule {}
