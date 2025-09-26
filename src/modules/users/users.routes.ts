import type { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

export async function usersRoutes(app: FastifyInstance) {
  const usersRepository = new UsersRepository();
  const usersService = new UsersService(usersRepository);
  const usersController = new UsersController(usersService);

  app.post('/', usersController.create.bind(usersController));
  app.get('/', usersController.list.bind(usersController));
  app.get('/:id', usersController.getById.bind(usersController));
  app.patch('/:id', usersController.update.bind(usersController));
  app.delete('/:id', usersController.delete.bind(usersController));
}
