import type { FastifyInstance } from 'fastify';
import z from 'zod';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { createUserSchema } from './users.schemas.js';
import { UsersService } from './users.service.js';

export async function usersRoutes(app: FastifyInstance) {
  const usersRepository = new UsersRepository();
  const usersService = new UsersService(usersRepository, app.log);
  const usersController = new UsersController(usersService);

  app.post(
    '/',
    {
      schema: {
        tags: ['Users'],
        body: createUserSchema,
        response: {
          200: z.array(createUserSchema),
        },
      },
    },
    usersController.create.bind(usersController)
  );
  app.get(
    '/',
    {
      schema: {
        tags: ['Users'],
      },
    },
    usersController.list.bind(usersController)
  );
  app.get(
    '/:id',
    {
      schema: {
        tags: ['Users'],
      },
    },
    usersController.getById.bind(usersController)
  );
  app.patch(
    '/:id',
    {
      schema: {
        tags: ['Users'],
      },
    },
    usersController.update.bind(usersController)
  );
  app.delete(
    '/:id',
    {
      schema: {
        tags: ['Users'],
      },
    },
    usersController.delete.bind(usersController)
  );
}
