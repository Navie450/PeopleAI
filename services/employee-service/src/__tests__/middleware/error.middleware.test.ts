import { ZodError } from 'zod';
import { errorHandler, notFoundHandler } from '../../middleware/error.middleware';
import { AppError, ValidationError, NotFoundError } from '../../utils/errors';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mock-express';

jest.mock('../../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('../../config/environment', () => ({
  env: { NODE_ENV: 'test' },
}));

describe('Error Middleware', () => {
  describe('errorHandler', () => {
    it('should handle ZodError as validation error', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['email'],
          message: 'Expected string, received number',
        },
      ]);

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(zodError, req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
        },
      });
      expect(res._json.error.details).toBeDefined();
    });

    it('should handle AppError with correct status code', () => {
      const error = new NotFoundError('Employee not found');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res._json).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Employee not found',
        },
      });
    });

    it('should handle ValidationError with details', () => {
      const error = new ValidationError('Bad input', [{ field: 'name', message: 'required' }]);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json.error.details).toBeDefined();
    });

    it('should handle unknown errors as 500', () => {
      const error = new Error('Something broke');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res._json).toMatchObject({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    });

    it('should include timestamp in error response', () => {
      const error = new AppError('test', 500, 'TEST');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(error, req as any, res as any, next);

      expect(res._json.error.timestamp).toBeDefined();
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 with route info', () => {
      const req = createMockRequest({ method: 'GET', path: '/unknown' });
      const res = createMockResponse();
      const next = createMockNext();

      notFoundHandler(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res._json).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route GET /unknown not found',
        },
      });
    });
  });
});
