import { FastifyRequest, JWTUserPayload } from '@app/types';

export class GetAuthTokenForSocket {
  constructor(
    public readonly user: JWTUserPayload,
    public readonly req: FastifyRequest,
  ) {}
}
