import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
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
          apiKey: {
            type: 'apiKey',
            name: 'apikey',
            in: 'header',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    // uiConfig: {
    //   docExpansion: 'full',
    //   deepLinking: false,
    // },
    // uiHooks: {
    //   onRequest: (_request, _reply, next) => {
    //     next();
    //   },
    //   preHandler: (_request, _reply, next) => {
    //     next();
    //   },
    // },
    // staticCSP: true,
    // transformStaticCSP: (header) => header,
    // transformSpecification: (swaggerObject, _request, _reply) => {
    //   return swaggerObject;
    // },
    // transformSpecificationClone: true,
  });
});
