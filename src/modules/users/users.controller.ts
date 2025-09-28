import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateUserInput, ParamsInput, QueryInput, UpdateUserInput } from './users.schemas.js';
import type { UsersService } from './users.service.js';

export class UsersController {
  constructor(private usersService: UsersService) {}

  async create(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    const user = await this.usersService.createUser(request.body);
    const { ...userWithoutPassword } = user;
    return reply.status(201).send(userWithoutPassword);
  }

  async getById(request: FastifyRequest<{ Params: ParamsInput }>, reply: FastifyReply) {
    const user = await this.usersService.getUserById(request.params.id);
    const { ...userWithoutPassword } = user;
    return reply.send(userWithoutPassword);
  }

  async update(
    request: FastifyRequest<{
      Params: ParamsInput;
      Body: UpdateUserInput;
    }>,
    reply: FastifyReply
  ) {
    const user = await this.usersService.updateUser(request.params.id, request.body);
    const { ...userWithoutPassword } = user;
    return reply.send(userWithoutPassword);
  }

  async delete(request: FastifyRequest<{ Params: ParamsInput }>, reply: FastifyReply) {
    await this.usersService.deleteUser(request.params.id);
    return reply.status(204).send();
  }

  async list(request: FastifyRequest<{ Querystring: QueryInput }>, reply: FastifyReply) {
    const { page, pageSize } = request.query;
    const users = await this.usersService.listUsers(page, pageSize);
    const usersWithoutPassword = users.map(({ passwordHash, ...user }) => user);
    return reply.send(usersWithoutPassword);
  }
}
