import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const paramsSchema = z.object({
  id: z.string().uuid(),
});

export const querySchema = z.object({
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().max(100).default(10),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
export type QueryInput = z.infer<typeof querySchema>;
