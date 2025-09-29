import { fastifySwagger } from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

export default fp(async (fastify: FastifyInstance) => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Backend API',
        description: 'Backend API with Fastify + Drizzle + PostgreSQL',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3333',
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'users', description: 'User related end-points' },
        { name: 'auth', description: 'Authentication related end-points' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    transform: jsonSchemaTransform,
  });

  fastify.get('/openapi.json', async () => {
    return fastify.swagger();
  });

  await fastify.register(ScalarApiReference, {
    routePrefix: '/documentation',
    configuration: {
      title: 'Backend API',
      url: '/openapi.json',
    },
  });
});
