"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const Role_1 = require("../entities/Role");
const UserRole_1 = require("../entities/UserRole");
const logger_1 = require("../utils/logger");
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
class AuthService {
    async register(email, password, firstName, lastName) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const roleRepository = database_1.AppDataSource.getRepository(Role_1.Role);
        const userRoleRepository = database_1.AppDataSource.getRepository(UserRole_1.UserRole);
        // Check if email already exists
        const existingUser = await userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new errors_1.ConflictError('User with this email already exists');
        }
        // Validate password strength
        const passwordValidation = (0, password_1.validatePasswordStrength)(password);
        if (!passwordValidation.valid) {
            throw new errors_1.ValidationError(`Password does not meet requirements: ${passwordValidation.errors.join(', ')}`);
        }
        try {
            // Hash password
            const passwordHash = await (0, password_1.hashPassword)(password);
            // Create user
            const user = userRepository.create({
                email,
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                display_name: firstName && lastName ? `${firstName} ${lastName}` : email,
                is_active: true,
                email_verified: false,
            });
            await userRepository.save(user);
            // Assign default 'user' role
            const userRole = await roleRepository.findOne({
                where: { name: 'user' },
            });
            if (userRole) {
                const userRoleEntry = userRoleRepository.create({
                    user_id: user.id,
                    role_id: userRole.id,
                });
                await userRoleRepository.save(userRoleEntry);
            }
            // Load user with roles
            const userWithRoles = await userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.user_roles', 'user_roles')
                .leftJoinAndSelect('user_roles.role', 'role')
                .where('user.id = :id', { id: user.id })
                .getOne();
            if (!userWithRoles) {
                throw new Error('Failed to load user after creation');
            }
            const roles = userWithRoles.user_roles?.map((ur) => ur.role.name) || [];
            userWithRoles.roles = roles;
            // Generate tokens
            const accessToken = (0, jwt_1.generateAccessToken)(userWithRoles.id, userWithRoles.email, roles);
            const refreshToken = (0, jwt_1.generateRefreshToken)(userWithRoles.id, userWithRoles.email);
            logger_1.logger.info('User registered successfully:', {
                userId: userWithRoles.id,
                email: userWithRoles.email,
            });
            return {
                tokens: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: 900, // 15 minutes
                    token_type: 'Bearer',
                },
                user: userWithRoles,
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to register user:', error);
            throw error;
        }
    }
    async login(email, password) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        try {
            // Find user by email
            const user = await userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.user_roles', 'user_roles')
                .leftJoinAndSelect('user_roles.role', 'role')
                .where('user.email = :email', { email })
                .andWhere('user.deleted_at IS NULL')
                .getOne();
            if (!user) {
                throw new errors_1.UnauthorizedError('Invalid email or password');
            }
            if (!user.is_active) {
                throw new errors_1.UnauthorizedError('User account is inactive');
            }
            // Verify password
            const isPasswordValid = await (0, password_1.verifyPassword)(password, user.password_hash);
            if (!isPasswordValid) {
                throw new errors_1.UnauthorizedError('Invalid email or password');
            }
            // Extract roles
            const roles = user.user_roles?.map((ur) => ur.role.name) || [];
            user.roles = roles;
            // Generate tokens
            const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.email, roles);
            const refreshToken = (0, jwt_1.generateRefreshToken)(user.id, user.email);
            // Update last login
            await this.updateLastLogin(user.id);
            logger_1.logger.info('User logged in successfully:', {
                userId: user.id,
                email: user.email,
            });
            return {
                tokens: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: 900, // 15 minutes
                    token_type: 'Bearer',
                },
                user,
            };
        }
        catch (error) {
            logger_1.logger.error('Login failed:', error);
            throw error;
        }
    }
    async refreshAccessToken(refreshToken) {
        try {
            // Verify refresh token
            const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
            // Get user from database
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.user_roles', 'user_roles')
                .leftJoinAndSelect('user_roles.role', 'role')
                .where('user.id = :userId', { userId: payload.sub })
                .andWhere('user.deleted_at IS NULL')
                .getOne();
            if (!user) {
                throw new errors_1.UnauthorizedError('User not found');
            }
            if (!user.is_active) {
                throw new errors_1.UnauthorizedError('User account is inactive');
            }
            // Extract roles
            const roles = user.user_roles?.map((ur) => ur.role.name) || [];
            // Generate new access token
            const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.email, roles);
            logger_1.logger.info('Access token refreshed successfully:', { userId: user.id });
            return {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: 900, // 15 minutes
                token_type: 'Bearer',
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to refresh token:', error);
            throw new errors_1.UnauthorizedError('Failed to refresh authentication');
        }
    }
    async changePassword(userId, oldPassword, newPassword) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        try {
            // Get user
            const user = await userRepository.findOne({
                where: { id: userId },
            });
            if (!user) {
                throw new errors_1.NotFoundError('User not found');
            }
            // Verify old password
            const isPasswordValid = await (0, password_1.verifyPassword)(oldPassword, user.password_hash);
            if (!isPasswordValid) {
                throw new errors_1.UnauthorizedError('Invalid current password');
            }
            // Validate new password strength
            const passwordValidation = (0, password_1.validatePasswordStrength)(newPassword);
            if (!passwordValidation.valid) {
                throw new errors_1.ValidationError(`Password does not meet requirements: ${passwordValidation.errors.join(', ')}`);
            }
            // Hash new password
            const passwordHash = await (0, password_1.hashPassword)(newPassword);
            // Update password
            user.password_hash = passwordHash;
            await userRepository.save(user);
            logger_1.logger.info('Password changed successfully:', { userId });
        }
        catch (error) {
            logger_1.logger.error('Failed to change password:', error);
            throw error;
        }
    }
    async logout(userId) {
        try {
            // In a production system, you might want to:
            // 1. Invalidate the refresh token by storing it in a blacklist
            // 2. Clear any session data
            // For now, we'll just log the logout
            logger_1.logger.info('User logged out:', { userId });
        }
        catch (error) {
            logger_1.logger.error('Logout error:', error);
            throw error;
        }
    }
    async updateLastLogin(userId) {
        try {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            await userRepository.update(userId, {
                last_login_at: new Date(),
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to update last login:', error);
        }
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map