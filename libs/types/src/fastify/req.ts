import { FastifyRequest as OriginalFastifyRequest } from 'fastify';
import { JWTUserPayload } from '../user/JWTUserPayload';

export type FastifyRequest = OriginalFastifyRequest & {
  user: JWTUserPayload;
};
