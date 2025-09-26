import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '@/utils/errors';

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

  request.log.error(error);

  return reply.status(500).send({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  });
}
