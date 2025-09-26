# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack & Architecture

This is a Node.js backend API built with:
- **Fastify** - Web framework with plugins
- **Drizzle ORM** - Type-safe SQL database toolkit
- **PostgreSQL** - Primary database
- **TypeScript** - Full type safety
- **Zod** - Runtime validation and type inference

## Essential Commands

### Development
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Database Operations
```bash
npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Run pending migrations
npm run db:push      # Push schema directly to database (development)
npm run db:studio    # Open Drizzle Studio for database GUI
```

### Testing
```bash
npm test            # Run tests with Vitest
npm run test:ui     # Run tests with UI interface
```

### Docker Development
```bash
docker-compose up -d          # Start PostgreSQL + app in containers
docker-compose up postgres    # Start only PostgreSQL
docker-compose down           # Stop all services
```

## Architecture Patterns

### Module Structure
Each feature module follows a strict layered architecture:
```
src/modules/{feature}/
├── {feature}.controller.ts  # HTTP request/response handling
├── {feature}.service.ts     # Business logic layer
├── {feature}.repository.ts  # Data access layer
├── {feature}.routes.ts      # Route definitions & DI
├── {feature}.schemas.ts     # Zod validation schemas
└── index.ts                 # Module exports
```

**Key Pattern**: Routes file handles dependency injection by instantiating Repository → Service → Controller chain.

### Database Schema
- **Location**: `src/db/schema/` - Each table gets its own file
- **Pattern**: Use `pgTable` for schema definition, `createInsertSchema`/`createSelectSchema` for Zod validation
- **Types**: Auto-generated from Drizzle schemas (e.g., `User`, `NewUser`)
- **Migrations**: Generated in `src/db/migrations/` via `npm run db:generate`

### Path Aliases (tsconfig.json)
```typescript
"@/*": ["./src/*"]           # @/config/database
"@config/*": ["./src/config/*"]  # @config/env
"@modules/*": ["./src/modules/*"] # @modules/users/users.service
"@utils/*": ["./src/utils/*"]     # @utils/errors
```

### Error Handling
Centralized error system in `src/utils/errors.ts`:
- `AppError` - Base error class with statusCode
- `ValidationError` - 400 errors
- `UnauthorizedError` - 401 errors
- `NotFoundError` - 404 errors
- `ConflictError` - 409 errors

Global error handler in `src/middleware/error-handler.ts` catches all errors and formats responses.

### Environment Configuration
Environment variables are validated with Zod in `src/config/env.ts`. Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Must be at least 32 characters
- Optional: `PORT`, `NODE_ENV`, `LOG_LEVEL`, rate limiting settings

Copy `.env.example` to `.env` and configure before starting development.

### Fastify Plugin System
Plugins are registered in `src/app.ts`:
- **CORS** (`@fastify/cors`) - Cross-origin resource sharing
- **JWT** (`@fastify/jwt`) - JWT authentication with `request.jwtVerify()`
- **Rate Limiting** (`@fastify/rate-limit`) - Request throttling
- **Swagger** (`@fastify/swagger*`) - API documentation at `/documentation`

## Adding New Features

### 1. Create Database Schema
```typescript
// src/db/schema/posts.ts
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  // ... other fields
});

export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);
export type Post = z.infer<typeof selectPostSchema>;
export type NewPost = z.infer<typeof insertPostSchema>;
```

### 2. Add to Schema Index
```typescript
// src/db/schema/index.ts
export * from './posts';
```

### 3. Generate Migration
```bash
npm run db:generate
npm run db:push  # or npm run db:migrate for production
```

### 4. Create Module Files
Follow the established pattern in `src/modules/users/` as a template. The routes file should handle dependency injection:

```typescript
// src/modules/posts/posts.routes.ts
export async function postsRoutes(app: FastifyInstance) {
  const postsRepository = new PostsRepository();
  const postsService = new PostsService(postsRepository);
  const postsController = new PostsController(postsService);

  // Register routes...
}
```

### 5. Register Routes
```typescript
// src/app.ts
app.register(postsRoutes, { prefix: '/api/posts' });
```

## Security Features
- **Input Validation**: All routes should use Zod schemas
- **Password Hashing**: `bcryptjs` in `src/utils/bcrypt.ts`
- **JWT Authentication**: Available via `app.authenticate` hook
- **Rate Limiting**: Configured per environment
- **CORS**: Configured for development (adjust for production)

## Development Setup
1. Copy `.env.example` to `.env` and configure `DATABASE_URL` and `JWT_SECRET`
2. Start PostgreSQL: `docker-compose up postgres -d`
3. Push database schema: `npm run db:push`
4. Start development server: `npm run dev`
5. API documentation available at: `http://localhost:3333/documentation`