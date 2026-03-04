import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { logger } from '../utils/logger';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const payload = verifyAccessToken(token);

    // Set user from JWT claims (no DB lookup needed)
    req.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    };

    logger.debug('User authenticated from JWT:', {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    });

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    };

    next();
  } catch (error) {
    logger.debug('Optional authentication failed:', error);
    next();
  }
};

export const requireRole = (...requiredRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userRoles = req.user.roles || [];
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        throw new ForbiddenError(
          `Access denied. Required role: ${requiredRoles.join(' or ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdmin = requireRole('admin');
