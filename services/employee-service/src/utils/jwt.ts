import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors';
import { logger } from './logger';
import { env } from '../config/environment';

export interface JWTPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'auth-service',
      audience: 'auth-service-api',
    }) as JWTPayload;

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    logger.error('Token verification error:', error);
    throw new UnauthorizedError('Token verification failed');
  }
};

export const extractTokenFromHeader = (
  authHeader?: string
): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};
