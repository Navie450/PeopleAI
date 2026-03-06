import jwt from 'jsonwebtoken';
import { authenticate, optionalAuthenticate, requireRole, requireAdmin } from '../../middleware/auth.middleware';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mock-express';

// Must mock before importing
jest.mock('../../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('../../config/environment', () => ({
  env: {
    JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters-long',
    JWT_ACCESS_TOKEN_EXPIRY: '15m',
  },
}));

const secret = 'test-jwt-secret-that-is-at-least-32-characters-long';

const createToken = (payload: Record<string, unknown> = {}) =>
  jwt.sign(
    { sub: 'user-123', email: 'test@example.com', roles: ['user'], ...payload },
    secret,
    { expiresIn: '15m', issuer: 'auth-service', audience: 'auth-service-api' }
  );

describe('Auth Middleware', () => {
  describe('authenticate', () => {
    it('should set req.user for valid token', async () => {
      const token = createToken();
      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
      expect(req.user!.id).toBe('user-123');
      expect(req.user!.email).toBe('test@example.com');
      expect(req.user!.roles).toEqual(['user']);
    });

    it('should call next with error if no token', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'No authentication token provided',
      }));
    });

    it('should call next with error for invalid token', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer invalid-token' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 401,
      }));
    });
  });

  describe('optionalAuthenticate', () => {
    it('should set req.user for valid token', async () => {
      const token = createToken();
      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await optionalAuthenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
      expect(req.user!.id).toBe('user-123');
    });

    it('should call next without error if no token', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await optionalAuthenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeUndefined();
    });

    it('should call next without error for invalid token', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer bad-token' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await optionalAuthenticate(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeUndefined();
    });
  });

  describe('requireRole', () => {
    it('should call next if user has required role', () => {
      const middleware = requireRole('admin');
      const req = createMockRequest({
        user: { id: 'user-1', email: 'a@b.com', roles: ['admin', 'user'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with ForbiddenError if role missing', () => {
      const middleware = requireRole('admin');
      const req = createMockRequest({
        user: { id: 'user-1', email: 'a@b.com', roles: ['user'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 403,
      }));
    });

    it('should call next with UnauthorizedError if no user', () => {
      const middleware = requireRole('admin');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 401,
      }));
    });

    it('should accept any of multiple roles', () => {
      const middleware = requireRole('admin', 'manager');
      const req = createMockRequest({
        user: { id: 'user-1', email: 'a@b.com', roles: ['manager'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('requireAdmin', () => {
    it('should allow admin role', () => {
      const req = createMockRequest({
        user: { id: 'user-1', email: 'a@b.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      requireAdmin(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny non-admin role', () => {
      const req = createMockRequest({
        user: { id: 'user-1', email: 'a@b.com', roles: ['user'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      requireAdmin(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 403,
      }));
    });
  });
});
