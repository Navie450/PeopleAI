import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { logger } from '../utils/logger';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    // Verify token
    const payload = verifyAccessToken(token);

    // Get user from database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user_roles', 'user_roles')
      .leftJoinAndSelect('user_roles.role', 'role')
      .where('user.id = :userId', {
        userId: payload.sub,
      })
      .andWhere('user.deleted_at IS NULL')
      .getOne();

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.is_active) {
      throw new UnauthorizedError('User account is inactive');
    }

    // Extract roles from user_roles relation
    if (user.user_roles) {
      user.roles = user.user_roles.map((ur) => ur.role.name);
    }

    // Attach user to request object
    req.user = user;

    logger.debug('User authenticated:', {
      userId: user.id,
      email: user.email,
      roles: user.roles,
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
      // No token provided, continue without authentication
      return next();
    }

    // Try to authenticate
    const payload = verifyAccessToken(token);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user_roles', 'user_roles')
      .leftJoinAndSelect('user_roles.role', 'role')
      .where('user.id = :userId', {
        userId: payload.sub,
      })
      .andWhere('user.deleted_at IS NULL')
      .getOne();

    if (user && user.is_active) {
      if (user.user_roles) {
        user.roles = user.user_roles.map((ur) => ur.role.name);
      }
      req.user = user;
    }

    next();
  } catch (error) {
    // Authentication failed but it's optional, so continue
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
