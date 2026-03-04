import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userRoles = req.user.roles || [];

      const hasRequiredRole = allowedRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        logger.warn('Access denied - insufficient permissions:', {
          userId: req.user.id,
          userRoles,
          requiredRoles: allowedRoles,
        });

        throw new ForbiddenError(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}`
        );
      }

      logger.debug('Role check passed:', {
        userId: req.user.id,
        userRoles,
        requiredRoles: allowedRoles,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdmin = requireRole('admin');

export const requireAdminOrManager = requireRole('admin', 'manager');

export const requireSelfOrAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userRoles = req.user.roles || [];
    const targetUserId = req.params.id;

    // Allow if user is admin or accessing their own resource
    if (userRoles.includes('admin') || req.user.id === targetUserId) {
      return next();
    }

    throw new ForbiddenError('Access denied. You can only access your own resources');
  } catch (error) {
    next(error);
  }
};
