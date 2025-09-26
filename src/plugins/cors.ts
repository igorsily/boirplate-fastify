import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });
});
