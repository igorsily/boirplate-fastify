# Estrutura Backend Node + Fastify + Drizzle + PostgreSQL

## 📁 Estrutura de Pastas

```
project-root/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── logger.ts
│   ├── db/
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── posts.ts
│   │   │   └── index.ts
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── index.ts
│   ├── modules/
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── users.schemas.ts
│   │   │   └── index.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schemas.ts
│   │   │   └── index.ts
│   │   └── posts/
│   │       └── ...
│   ├── plugins/
│   │   ├── cors.ts
│   │   ├── jwt.ts
│   │   ├── rate-limit.ts
│   │   └── swagger.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error-handler.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── bcrypt.ts
│   │   ├── errors.ts
│   │   └── response.ts
│   ├── types/
│   │   ├── fastify.d.ts
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .gitignore
├── drizzle.config.ts
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── README.md
```

## 📦 Dependências

### package.json

```json
{
  "name": "backend-fastify-drizzle",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src --out-dir dist",
    "start": "node dist/server.js",
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "tsx src/db/migrate.ts",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/jwt": "^8.0.0",
    "@fastify/rate-limit": "^9.1.0",
    "@fastify/swagger": "^8.14.0",
    "@fastify/swagger-ui": "^3.0.0",
    "bcryptjs": "^2.4.3",
    "drizzle-orm": "^0.32.0",
    "drizzle-zod": "^0.5.1",
    "fastify": "^4.27.0",
    "fastify-plugin": "^4.5.1",
    "pg": "^8.12.0",
    "pino": "^9.2.0",
    "pino-pretty": "^11.2.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.14.0",
    "@types/pg": "^8.11.6",
    "@typescript-eslint/eslint-plugin": "^7.13.0",
    "@typescript-eslint/parser": "^7.13.0",
    "drizzle-kit": "^0.23.0",
    "eslint": "^8.57.0",
    "prettier": "^3.3.2",
    "tsup": "^8.1.0",
    "tsx": "^4.15.0",
    "typescript": "^5.4.5",
    "vite-tsconfig-paths": "^4.3.2",
    "vitest": "^1.6.0"
  }
}
```

## 🔧 Configurações

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@config/*": ["./src/config/*"],
      "@modules/*": ["./src/modules/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### drizzle.config.ts

```typescript
import type { Config } from 'drizzle-kit';
import { env } from './src/config/env';

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

### .env.example

```bash
# Server
NODE_ENV=development
PORT=3333
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/database_name

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15m

# Logging
LOG_LEVEL=debug
```

## 💻 Implementação

### src/config/env.ts

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.string().default('15m'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
```

### src/config/database.ts

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/db/schema';
import { env } from './env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
```

### src/db/schema/users.ts

```typescript
import { pgTable, uuid, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  username: z.string().min(3).max(50),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export const selectUserSchema = createSelectSchema(users);

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
```

### src/db/schema/posts.ts

```typescript
import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  authorId: uuid('author_id').notNull().references(() => users.id),
  viewCount: integer('view_count').default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

### src/db/schema/index.ts

```typescript
export * from './users';
export * from './posts';
```

### src/utils/errors.ts

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}
```

### src/utils/bcrypt.ts

```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### src/modules/users/users.repository.ts

```typescript
import { db } from '@/config/database';
import { users, User, NewUser } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export class UsersRepository {
  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  }

  async update(id: string, data: Partial<NewUser>): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async findAll(limit = 10, offset = 0): Promise<User[]> {
    return db.select().from(users).limit(limit).offset(offset);
  }
}
```

### src/modules/users/users.service.ts

```typescript
import { UsersRepository } from './users.repository';
import { NewUser, User } from '@/db/schema/users';
import { hashPassword } from '@/utils/bcrypt';
import { ConflictError, NotFoundError } from '@/utils/errors';

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
```

### src/modules/users/users.controller.ts

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { UsersService } from './users.service';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const querySchema = z.object({
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().max(100).default(10),
});

export class UsersController {
  constructor(private usersService: UsersService) {}

  async create(
    request: FastifyRequest<{ Body: z.infer<typeof createUserSchema> }>,
    reply: FastifyReply
  ) {
    const user = await this.usersService.createUser(request.body);
    const { passwordHash, ...userWithoutPassword } = user;
    return reply.status(201).send(userWithoutPassword);
  }

  async getById(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const user = await this.usersService.getUserById(request.params.id);
    const { passwordHash, ...userWithoutPassword } = user;
    return reply.send(userWithoutPassword);
  }

  async update(
    request: FastifyRequest<{
      Params: z.infer<typeof paramsSchema>;
      Body: z.infer<typeof updateUserSchema>;
    }>,
    reply: FastifyReply
  ) {
    const user = await this.usersService.updateUser(request.params.id, request.body);
    const { passwordHash, ...userWithoutPassword } = user;
    return reply.send(userWithoutPassword);
  }

  async delete(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    await this.usersService.deleteUser(request.params.id);
    return reply.status(204).send();
  }

  async list(
    request: FastifyRequest<{ Querystring: z.infer<typeof querySchema> }>,
    reply: FastifyReply
  ) {
    const { page, pageSize } = request.query;
    const users = await this.usersService.listUsers(page, pageSize);
    const usersWithoutPassword = users.map(({ passwordHash, ...user }) => user);
    return reply.send(usersWithoutPassword);
  }
}
```

### src/modules/users/users.routes.ts

```typescript
import { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

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
```

### src/middleware/error-handler.ts

```typescript
import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '@/utils/errors';
import { ZodError } from 'zod';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.code || 'APP_ERROR',
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Validation failed',
      issues: error.issues,
      statusCode: 400,
    });
  }

  // Log unexpected errors
  request.log.error(error);

  return reply.status(500).send({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  });
}
```

### src/plugins/cors.ts

```typescript
import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });
});
```

### src/plugins/jwt.ts

```typescript
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { env } from '@/config/env';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
}

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  });

  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
```

### src/app.ts

```typescript
import fastify from 'fastify';
import { errorHandler } from './middleware/error-handler';
import corsPlugin from './plugins/cors';
import jwtPlugin from './plugins/jwt';
import { usersRoutes } from './modules/users/users.routes';
import { env } from './config/env';

export async function buildApp() {
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: env.NODE_ENV === 'development'
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

  // Plugins
  await app.register(corsPlugin);
  await app.register(jwtPlugin);

  // Error handler
  app.setErrorHandler(errorHandler);

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  // Routes
  app.register(usersRoutes, { prefix: '/api/users' });

  return app;
}
```

### src/server.ts

```typescript
import { buildApp } from './app';
import { env } from './config/env';

async function main() {
  const app = await buildApp();

  try {
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });
    console.log(`🚀 Server running at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: backend_postgres
    environment:
      POSTGRES_USER: backend_user
      POSTGRES_PASSWORD: backend_password
      POSTGRES_DB: backend_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U backend_user']
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: backend_app
    environment:
      DATABASE_URL: postgresql://backend_user:backend_password@postgres:5432/backend_db
      JWT_SECRET: your-super-secret-jwt-key-change-this-in-production
      NODE_ENV: development
    ports:
      - '3333:3333'
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./src:/app/src
      - ./package.json:/app/package.json
    command: npm run dev

volumes:
  postgres_data:
```

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS build
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3333
CMD ["node", "dist/server.js"]

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3333
CMD ["npm", "run", "dev"]
```

## 🚀 Comandos Úteis

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Banco de dados
npm run db:generate    # Gerar migrações
npm run db:migrate     # Executar migrações
npm run db:push        # Push do schema
npm run db:studio      # Abrir Drizzle Studio

# Testes
npm test              # Executar testes
npm run test:ui       # Interface de testes

# Qualidade de código
npm run lint          # Verificar código
npm run format        # Formatar código

# Docker
docker-compose up -d  # Iniciar serviços
docker-compose down   # Parar serviços
```

## 📝 Próximos Passos

1. **Autenticação completa**: Implementar refresh tokens, reset de senha, verificação de email
2. **Validação avançada**: Adicionar validação de schemas em todas as rotas
3. **Cache**: Implementar Redis para cache
4. **Queue**: Adicionar BullMQ para processamento assíncrono
5. **Monitoramento**: Integrar APM (Application Performance Monitoring)
6. **Testes**: Adicionar testes unitários, integração e E2E
7. **CI/CD**: Configurar pipelines de deploy
8. **Documentação**: Adicionar Swagger/OpenAPI
9. **WebSockets**: Implementar comunicação real-time
10. **GraphQL**: Adicionar camada GraphQL opcional

## 🔒 Segurança

- Validação de entrada com Zod
- Rate limiting configurado
- Helmet para headers de segurança
- JWT para autenticação
- Bcrypt para hash de senhas
- Variáveis de ambiente para configurações sensíveis
- SQL injection prevenido pelo Drizzle ORM
- CORS configurado apropriadamente

## 🎯 Melhores Práticas Implementadas

- **Arquitetura em camadas**: Controller → Service → Repository
- **Injeção de dependências**: Facilita testes e manutenção
- **Tipagem forte**: TypeScript em todo o projeto
- **ORM type-safe**: Drizzle com schemas validados
- **Error handling centralizado**: Middleware de erro global
- **Logging estruturado**: Pino logger
- **Configuração centralizada**: Variáveis de ambiente validadas
- **Docker ready**: Desenvolvimento e produção
- **Modularização**: Código organizado por funcionalidade
