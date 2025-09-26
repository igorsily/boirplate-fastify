import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '@/utils/errors';

export async function authMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (_err) {
    throw new UnauthorizedError('Invalid or missing token');
  }
}
