"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = exports.optionalAuthenticate = exports.authenticate = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const authenticate = async (req, _res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            throw new errors_1.UnauthorizedError('No authentication token provided');
        }
        // Verify token
        const payload = (0, jwt_1.verifyAccessToken)(token);
        // Get user from database
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
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
            throw new errors_1.UnauthorizedError('User not found');
        }
        if (!user.is_active) {
            throw new errors_1.UnauthorizedError('User account is inactive');
        }
        // Extract roles from user_roles relation
        if (user.user_roles) {
            user.roles = user.user_roles.map((ur) => ur.role.name);
        }
        // Attach user to request object
        req.user = user;
        logger_1.logger.debug('User authenticated:', {
            userId: user.id,
            email: user.email,
            roles: user.roles,
        });
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const optionalAuthenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            // No token provided, continue without authentication
            return next();
        }
        // Try to authenticate
        const payload = (0, jwt_1.verifyAccessToken)(token);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
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
    }
    catch (error) {
        // Authentication failed but it's optional, so continue
        logger_1.logger.debug('Optional authentication failed:', error);
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
const requireRole = (...requiredRoles) => {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new errors_1.UnauthorizedError('Authentication required');
            }
            const userRoles = req.user.roles || [];
            const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));
            if (!hasRequiredRole) {
                throw new errors_1.ForbiddenError(`Access denied. Required role: ${requiredRoles.join(' or ')}`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)('admin');
//# sourceMappingURL=auth.middleware.js.map