"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSelfOrAdmin = exports.requireAdminOrManager = exports.requireAdmin = exports.requireRole = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new errors_1.UnauthorizedError('Authentication required');
            }
            const userRoles = req.user.roles || [];
            const hasRequiredRole = allowedRoles.some((role) => userRoles.includes(role));
            if (!hasRequiredRole) {
                logger_1.logger.warn('Access denied - insufficient permissions:', {
                    userId: req.user.id,
                    userRoles,
                    requiredRoles: allowedRoles,
                });
                throw new errors_1.ForbiddenError(`Access denied. Required role(s): ${allowedRoles.join(', ')}`);
            }
            logger_1.logger.debug('Role check passed:', {
                userId: req.user.id,
                userRoles,
                requiredRoles: allowedRoles,
            });
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)('admin');
exports.requireAdminOrManager = (0, exports.requireRole)('admin', 'manager');
const requireSelfOrAdmin = (req, _res, next) => {
    try {
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Authentication required');
        }
        const userRoles = req.user.roles || [];
        const targetUserId = req.params.id;
        // Allow if user is admin or accessing their own resource
        if (userRoles.includes('admin') || req.user.id === targetUserId) {
            return next();
        }
        throw new errors_1.ForbiddenError('Access denied. You can only access your own resources');
    }
    catch (error) {
        next(error);
    }
};
exports.requireSelfOrAdmin = requireSelfOrAdmin;
//# sourceMappingURL=rbac.middleware.js.map