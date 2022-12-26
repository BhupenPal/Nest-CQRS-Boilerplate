import { FastifyReply, FastifyRequest, JWTUserPayload } from '@app/types';

export class SetAuthTokenCommand {
  constructor(
    public readonly user: JWTUserPayload,
    public readonly req: FastifyRequest,
    public readonly res: FastifyReply,
  ) {}
}
