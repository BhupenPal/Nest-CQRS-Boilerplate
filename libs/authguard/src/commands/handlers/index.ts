import { SetAuthTokenHandler } from './set-auth-token.handler';
import { AuthenticateUserHandler } from './authorize-socket.handler';

export const AuthTokenCommandHandler = [
  SetAuthTokenHandler,
  AuthenticateUserHandler,
];
