import { FastifyReply } from '@app/types';

export class SetAuthTokenCommand {
  constructor(public readonly user: any, public readonly res: FastifyReply) {}
}
