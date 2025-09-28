import type { FastifyRequest as OriginalFastifyRequest } from 'fastify';

declare module 'fastify' {
  type FastifyRequest = OriginalFastifyRequest & {
    user?: {
      id: string;
      email: string;
      username: string;
    };
  };
}
