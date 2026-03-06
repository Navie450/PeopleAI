"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = exports.optionalAuthenticate = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            throw new errors_1.UnauthorizedError('No authentication token provided');
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        // Set user from JWT claims (no DB lookup needed)
        req.user = {
            id: payload.sub,
            email: payload.email,
            roles: payload.roles || [],
        };
        logger_1.logger.debug('User authenticated from JWT:', {
            userId: payload.sub,
            email: payload.email,
            roles: payload.roles,
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
            return next();
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            roles: payload.roles || [],
        };
        next();
    }
    catch (error) {
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