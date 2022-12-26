import { FastifyRequest, JWTUserPayload } from '@app/types';

export class GetAuthTokenForSocketCommand {
  constructor(
    public readonly user: JWTUserPayload,
    public readonly req: FastifyRequest,
  ) {}
}
