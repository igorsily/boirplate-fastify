import type { FastifyReply, FastifyRequest } from 'fastify';
import { type ZodSchema, z } from 'zod';
import { ValidationError } from '@/utils/errors';

export function validateSchema(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      const validatedData = schema.parse(request.body);
      request.body = validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Validation failed');
      }
      throw error;
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      const validatedData = schema.parse(request.params);
      request.params = validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid parameters');
      }
      throw error;
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      const validatedData = schema.parse(request.query);
      request.query = validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid query parameters');
      }
      throw error;
    }
  };
}
