import jwt from 'jsonwebtoken';

jest.mock('../../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('../../config/environment', () => ({
  env: {
    JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters-long',
    JWT_REFRESH_SECRET: 'test-refresh-secret-that-is-at-least-32-characters',
    JWT_ACCESS_TOKEN_EXPIRY: '15m',
    JWT_REFRESH_TOKEN_EXPIRY: '7d',
  },
}));

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractTokenFromHeader,
} from '../../utils/jwt';
import { UnauthorizedError } from '../../utils/errors';

const accessSecret = 'test-jwt-secret-that-is-at-least-32-characters-long';
const refreshSecret = 'test-refresh-secret-that-is-at-least-32-characters';

describe('JWT Utils (Auth Service)', () => {
  describe('generateAccessToken', () => {
    it('should generate a valid JWT access token', () => {
      const token = generateAccessToken('user-123', 'test@example.com', ['user']);
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, accessSecret, {
        issuer: 'auth-service',
        audience: 'auth-service-api',
      }) as any;
      expect(decoded.sub).toBe('user-123');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.roles).toEqual(['user']);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid JWT refresh token', () => {
      const token = generateRefreshToken('user-123', 'test@example.com');
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, refreshSecret, {
        issuer: 'auth-service',
        audience: 'auth-service-api',
      }) as any;
      expect(decoded.sub).toBe('user-123');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.type).toBe('refresh');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and return payload for valid token', () => {
      const token = generateAccessToken('user-123', 'test@example.com', ['admin']);
      const payload = verifyAccessToken(token);
      expect(payload.sub).toBe('user-123');
      expect(payload.email).toBe('test@example.com');
      expect(payload.roles).toEqual(['admin']);
    });

    it('should throw UnauthorizedError for expired token', () => {
      const token = jwt.sign(
        { sub: 'user-123', email: 'test@example.com', roles: [] },
        accessSecret,
        { expiresIn: '0s', issuer: 'auth-service', audience: 'auth-service-api' }
      );
      expect(() => verifyAccessToken(token)).toThrow(UnauthorizedError);
      expect(() => verifyAccessToken(token)).toThrow('Token has expired');
    });

    it('should throw UnauthorizedError for invalid token', () => {
      expect(() => verifyAccessToken('garbage')).toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for wrong secret', () => {
      const token = jwt.sign(
        { sub: 'user-123', email: 'test@example.com', roles: [] },
        'wrong-secret-which-is-32-chars-long!!',
        { expiresIn: '15m', issuer: 'auth-service', audience: 'auth-service-api' }
      );
      expect(() => verifyAccessToken(token)).toThrow(UnauthorizedError);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and return payload for valid refresh token', () => {
      const token = generateRefreshToken('user-123', 'test@example.com');
      const payload = verifyRefreshToken(token);
      expect(payload.sub).toBe('user-123');
      expect(payload.email).toBe('test@example.com');
      expect(payload.type).toBe('refresh');
    });

    it('should throw UnauthorizedError for expired refresh token', () => {
      const token = jwt.sign(
        { sub: 'user-123', email: 'test@example.com', type: 'refresh' },
        refreshSecret,
        { expiresIn: '0s', issuer: 'auth-service', audience: 'auth-service-api' }
      );
      expect(() => verifyRefreshToken(token)).toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for wrong token type', () => {
      const token = jwt.sign(
        { sub: 'user-123', email: 'test@example.com', type: 'access' },
        refreshSecret,
        { expiresIn: '7d', issuer: 'auth-service', audience: 'auth-service-api' }
      );
      expect(() => verifyRefreshToken(token)).toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for invalid token', () => {
      expect(() => verifyRefreshToken('invalid')).toThrow(UnauthorizedError);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      expect(extractTokenFromHeader('Bearer mytoken123')).toBe('mytoken123');
    });

    it('should return null for missing header', () => {
      expect(extractTokenFromHeader(undefined)).toBeNull();
    });

    it('should return null for empty header', () => {
      expect(extractTokenFromHeader('')).toBeNull();
    });

    it('should return null for non-Bearer scheme', () => {
      expect(extractTokenFromHeader('Basic abc')).toBeNull();
    });

    it('should return null for malformed header', () => {
      expect(extractTokenFromHeader('Bearer')).toBeNull();
    });
  });
});
