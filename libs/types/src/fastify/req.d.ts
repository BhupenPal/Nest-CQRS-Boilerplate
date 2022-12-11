import { FastifyRequest as OriginalFastifyRequest } from 'fastify';
import { JWTUserPayload } from '../user/JWTUserPayload';

type FastifyRequest = OriginalFastifyRequest & {
  user: JWTUserPayload;
};
