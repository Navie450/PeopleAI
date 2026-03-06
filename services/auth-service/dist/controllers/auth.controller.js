"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.changePassword = exports.refreshToken = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_dto_1 = require("../dto/auth.dto");
const logger_1 = require("../utils/logger");
const register = async (req, res, next) => {
    try {
        const { email, password, first_name, last_name } = auth_dto_1.registerSchema.parse(req.body);
        const { tokens, user } = await auth_service_1.authService.register(email, password, first_name, last_name);
        const userResponse = {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            display_name: user.display_name,
            roles: user.roles || [],
            is_active: user.is_active,
            email_verified: user.email_verified,
            last_login_at: user.last_login_at,
            created_at: user.created_at,
        };
        const response = {
            success: true,
            data: {
                tokens,
                user: userResponse,
            },
            message: 'Registration successful',
        };
        logger_1.logger.info('User registered successfully:', {
            userId: user.id,
            email: user.email,
        });
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = auth_dto_1.loginSchema.parse(req.body);
        const { tokens, user } = await auth_service_1.authService.login(email, password);
        const userResponse = {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            display_name: user.display_name,
            roles: user.roles || [],
            is_active: user.is_active,
            email_verified: user.email_verified,
            last_login_at: user.last_login_at,
            created_at: user.created_at,
        };
        const response = {
            success: true,
            data: {
                tokens,
                user: userResponse,
            },
            message: 'Login successful',
        };
        logger_1.logger.info('User logged in successfully:', {
            userId: user.id,
            email: user.email,
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        const { refresh_token } = auth_dto_1.refreshTokenSchema.parse(req.body);
        const tokens = await auth_service_1.authService.refreshAccessToken(refresh_token);
        const response = {
            success: true,
            data: { tokens },
            message: 'Token refreshed successfully',
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const changePassword = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const { old_password, new_password } = auth_dto_1.changePasswordSchema.parse(req.body);
        await auth_service_1.authService.changePassword(req.user.id, old_password, new_password);
        const response = {
            success: true,
            message: 'Password changed successfully',
        };
        logger_1.logger.info('Password changed:', { userId: req.user.id });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
const logout = async (req, res, next) => {
    try {
        if (!req.user) {
            const response = {
                success: true,
                message: 'Logged out successfully',
            };
            return res.json(response);
        }
        await auth_service_1.authService.logout(req.user.id);
        const response = {
            success: true,
            message: 'Logged out successfully',
        };
        logger_1.logger.info('User logged out:', { userId: req.user.id });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const userResponse = {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            display_name: req.user.display_name,
            roles: req.user.roles || [],
            is_active: req.user.is_active,
            email_verified: req.user.email_verified,
            last_login_at: req.user.last_login_at,
            created_at: req.user.created_at,
        };
        const response = {
            success: true,
            data: userResponse,
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=auth.controller.js.map