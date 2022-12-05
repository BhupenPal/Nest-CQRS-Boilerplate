import { FastifyRequest as OriginalFastifyRequest } from 'fastify';
import { JwtUserPayload } from './req.user';

type FastifyRequest = OriginalFastifyRequest & {
  user: JwtUserPayload;
};
