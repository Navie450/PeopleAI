import jwt from 'jsonwebtoken';

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

import { verifyAccessToken, extractTokenFromHeader } from '../../utils/jwt';
import { UnauthorizedError } from '../../utils/errors';

describe('JWT Utils', () => {
  const secret = 'test-jwt-secret-that-is-at-least-32-characters-long';

  const createValidToken = (payload: Record<string, unknown> = {}) =>
    jwt.sign(
      { sub: 'user-123', email: 'test@example.com', roles: ['user'], ...payload },
      secret,
      { expiresIn: '15m', issuer: 'auth-service', audience: 'auth-service-api' }
    );

  describe('verifyAccessToken', () => {
    it('should verify a valid token and return payload', () => {
      const token = createValidToken();
      const payload = verifyAccessToken(token);
      expect(payload.sub).toBe('user-123');
      expect(payload.email).toBe('test@example.com');
      expect(payload.roles).toEqual(['user']);
    });

    it('should throw UnauthorizedError for expired token', () => {
      const token = jwt.sign(
        { sub: 'user-123', email: 'test@example.com', roles: [] },
        secret,
        { expiresIn: '0s', issuer: 'auth-service', audience: 'auth-service-api' }
      );
      expect(() => verifyAccessToken(token)).toThrow(UnauthorizedError);
      expect(() => verifyAccessToken(token)).toThrow('Token has expired');
    });

    it('should throw UnauthorizedError for invalid token', () => {
      expect(() => verifyAccessToken('invalid.token.here')).toThrow(UnauthorizedError);
      expect(() => verifyAccessToken('invalid.token.here')).toThrow('Invalid token');
    });

    it('should throw UnauthorizedError for token signed with wrong secret', () => {
      const token = jwt.sign(
        { sub: 'user-123', email: 'test@example.com', roles: [] },
        'wrong-secret-that-is-also-32-chars-long',
        { expiresIn: '15m', issuer: 'auth-service', audience: 'auth-service-api' }
      );
      expect(() => verifyAccessToken(token)).toThrow(UnauthorizedError);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      expect(extractTokenFromHeader('Bearer abc123')).toBe('abc123');
    });

    it('should return null for missing header', () => {
      expect(extractTokenFromHeader(undefined)).toBeNull();
    });

    it('should return null for empty header', () => {
      expect(extractTokenFromHeader('')).toBeNull();
    });

    it('should return null for non-Bearer scheme', () => {
      expect(extractTokenFromHeader('Basic abc123')).toBeNull();
    });

    it('should return null for malformed header', () => {
      expect(extractTokenFromHeader('Bearer')).toBeNull();
      expect(extractTokenFromHeader('Bearer a b')).toBeNull();
    });
  });
});
