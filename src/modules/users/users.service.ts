import type { NewUser, User } from '@/db/schema/users';
import { hashPassword } from '@/utils/bcrypt';
import { ConflictError, NotFoundError } from '@/utils/errors';
import type { UsersRepository } from './users.repository';

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(data: Omit<NewUser, 'passwordHash'> & { password: string }): Promise<User> {
    const { password, ...userData } = data;

    const existingEmail = await this.usersRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new ConflictError('Email already exists');
    }

    const existingUsername = await this.usersRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new ConflictError('Username already exists');
    }

    const passwordHash = await hashPassword(password);

    return this.usersRepository.create({
      ...userData,
      passwordHash,
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async updateUser(id: string, data: Partial<NewUser>): Promise<User> {
    const user = await this.usersRepository.update(id, data);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('User');
    }
  }

  async listUsers(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    return this.usersRepository.findAll(pageSize, offset);
  }
}
