import fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { usersRoutes } from './modules/users/users.routes.js';
import corsPlugin from './plugins/cors.js';
import jwtPlugin from './plugins/jwt.js';
import rateLimitPlugin from './plugins/rate-limit.js';
import swaggerPlugin from './plugins/swagger.js';

export async function buildApp() {
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                ignore: 'pid,hostname',
                translateTime: 'HH:MM:ss Z',
              },
            }
          : undefined,
    },
  }).withTypeProvider<ZodTypeProvider>();

  await app.register(corsPlugin);
  await app.register(jwtPlugin);
  await app.register(rateLimitPlugin);
  await app.register(swaggerPlugin);

  app.setErrorHandler(errorHandler);

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  app.register(usersRoutes, { prefix: '/api/users' });

  return app;
}
