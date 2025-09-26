import fastify from 'fastify';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { usersRoutes } from './modules/users/users.routes';
import corsPlugin from './plugins/cors';
import jwtPlugin from './plugins/jwt';
import rateLimitPlugin from './plugins/rate-limit';
import swaggerPlugin from './plugins/swagger';

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
  });

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
