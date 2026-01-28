import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { env } from '../config/environment';
import { ApiError } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    requestId: req.requestId,
    path: req.path,
    method: req.method,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationError = new ValidationError(
      'Validation failed',
      err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }))
    );
    return sendErrorResponse(res, validationError);
  }

  // Handle known application errors
  if (err instanceof AppError) {
    return sendErrorResponse(res, err);
  }

  // Handle unknown errors
  const statusCode = 500;
  const response: ApiError = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err.message,
      timestamp: new Date().toISOString(),
    },
  };

  // Include stack trace in development
  if (env.NODE_ENV === 'development') {
    response.error.details = {
      stack: err.stack,
    };
  }

  res.status(statusCode).json(response);
};

const sendErrorResponse = (res: Response, err: AppError) => {
  const response: ApiError = {
    success: false,
    error: {
      code: err.code,
      message: err.message,
      timestamp: new Date().toISOString(),
    },
  };

  if (err.details) {
    response.error.details = err.details;
  }

  res.status(err.statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const response: ApiError = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(404).json(response);
};
