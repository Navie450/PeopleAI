"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("./errors");
const logger_1 = require("./logger");
const environment_1 = require("../config/environment");
const generateAccessToken = (userId, email, roles) => {
    try {
        const payload = {
            sub: userId,
            email,
            roles,
        };
        const token = jsonwebtoken_1.default.sign(payload, environment_1.env.JWT_SECRET, {
            expiresIn: environment_1.env.JWT_ACCESS_TOKEN_EXPIRY,
            issuer: 'auth-service',
            audience: 'auth-service-api',
        });
        return token;
    }
    catch (error) {
        logger_1.logger.error('Failed to generate access token:', error);
        throw new Error('Failed to generate access token');
    }
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId, email) => {
    try {
        const payload = {
            sub: userId,
            email,
            type: 'refresh',
        };
        const token = jsonwebtoken_1.default.sign(payload, environment_1.env.JWT_REFRESH_SECRET, {
            expiresIn: environment_1.env.JWT_REFRESH_TOKEN_EXPIRY,
            issuer: 'auth-service',
            audience: 'auth-service-api',
        });
        return token;
    }
    catch (error) {
        logger_1.logger.error('Failed to generate refresh token:', error);
        throw new Error('Failed to generate refresh token');
    }
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, environment_1.env.JWT_SECRET, {
            issuer: 'auth-service',
            audience: 'auth-service-api',
        });
        return payload;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new errors_1.UnauthorizedError('Token has expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new errors_1.UnauthorizedError('Invalid token');
        }
        logger_1.logger.error('Token verification error:', error);
        throw new errors_1.UnauthorizedError('Token verification failed');
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, environment_1.env.JWT_REFRESH_SECRET, {
            issuer: 'auth-service',
            audience: 'auth-service-api',
        });
        if (payload.type !== 'refresh') {
            throw new errors_1.UnauthorizedError('Invalid token type');
        }
        return payload;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new errors_1.UnauthorizedError('Refresh token has expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new errors_1.UnauthorizedError('Invalid refresh token');
        }
        logger_1.logger.error('Refresh token verification error:', error);
        throw new errors_1.UnauthorizedError('Refresh token verification failed');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=jwt.js.map