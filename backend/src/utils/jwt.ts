import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors';
import { logger } from './logger';
import { env } from '../config/environment';

export interface JWTPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (
  userId: string,
  email: string,
  roles: string[]
): string => {
  try {
    const payload: JWTPayload = {
      sub: userId,
      email,
      roles,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY,
      issuer: 'auth-service',
      audience: 'auth-service-api',
    } as jwt.SignOptions);

    return token;
  } catch (error) {
    logger.error('Failed to generate access token:', error);
    throw new Error('Failed to generate access token');
  }
};

export const generateRefreshToken = (
  userId: string,
  email: string
): string => {
  try {
    const payload = {
      sub: userId,
      email,
      type: 'refresh',
    };

    const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY,
      issuer: 'auth-service',
      audience: 'auth-service-api',
    } as jwt.SignOptions);

    return token;
  } catch (error) {
    logger.error('Failed to generate refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

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

export const verifyRefreshToken = (
  token: string
): { sub: string; email: string; type: string } => {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: 'auth-service',
      audience: 'auth-service-api',
    }) as { sub: string; email: string; type: string };

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    logger.error('Refresh token verification error:', error);
    throw new UnauthorizedError('Refresh token verification failed');
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
