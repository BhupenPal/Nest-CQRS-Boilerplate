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

const setAuthTokenCQRS = [...AuthTokenCommandHandler];

const authGuards = [
  LocalAuthGuard,
  JWTAuthGuard,
  JWTLooseAuthGuard,
  JWTRefreshAuthGuard,
  RecaptchaAuthGuard,
];

@Global()
@Module({
  imports: [HttpModule],
  providers: [...authGuards, ...setAuthTokenCQRS],
  exports: [...authGuards, ...setAuthTokenCQRS],
})
export class AuthGuardModule {}
