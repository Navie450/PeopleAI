"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const Role_1 = require("../entities/Role");
const UserRole_1 = require("../entities/UserRole");
const AuditLog_1 = require("../entities/AuditLog");
const typeorm_1 = require("typeorm");
const logger_1 = require("../utils/logger");
const password_1 = require("../utils/password");
const errors_1 = require("../utils/errors");
class UserService {
    async listUsers(query) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const page = query.page || 1;
        const limit = Math.min(query.limit || 10, 100); // Max 100 per page
        const skip = (page - 1) * limit;
        const queryBuilder = userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.user_roles', 'user_roles')
            .leftJoinAndSelect('user_roles.role', 'role')
            .where('user.deleted_at IS NULL');
        // Apply filters
        if (query.search) {
            queryBuilder.andWhere('(user.email ILIKE :search OR user.username ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query.is_active !== undefined) {
            queryBuilder.andWhere('user.is_active = :isActive', {
                isActive: query.is_active,
            });
        }
        if (query.role) {
            queryBuilder.andWhere('role.name = :roleName', {
                roleName: query.role,
            });
        }
        // Get total count
        const total = await queryBuilder.getCount();
        // Get paginated results
        const users = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('user.created_at', 'DESC')
            .getMany();
        const userResponses = users.map((user) => ({
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            roles: user.user_roles?.map((ur) => ur.role.name) || [],
            is_active: user.is_active,
            last_login_at: user.last_login_at,
            created_at: user.created_at,
        }));
        const meta = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
        return { users: userResponses, meta };
    }
    async getUserById(userId) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.user_roles', 'user_roles')
            .leftJoinAndSelect('user_roles.role', 'role')
            .where('user.id = :userId', { userId })
            .andWhere('user.deleted_at IS NULL')
            .getOne();
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return this.mapToUserDetailResponse(user);
    }
    async createUser(userData, createdBy) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const roleRepository = database_1.AppDataSource.getRepository(Role_1.Role);
        // Check if email already exists
        const existingUser = await userRepository.findOne({
            where: { email: userData.email },
        });
        if (existingUser) {
            throw new errors_1.ConflictError('User with this email already exists');
        }
        // Validate password if provided
        if (userData.password) {
            const passwordValidation = (0, password_1.validatePasswordStrength)(userData.password);
            if (!passwordValidation.valid) {
                throw new errors_1.ValidationError(`Password does not meet requirements: ${passwordValidation.errors.join(', ')}`);
            }
        }
        try {
            // Hash password
            const passwordHash = userData.password
                ? await (0, password_1.hashPassword)(userData.password)
                : await (0, password_1.hashPassword)(Math.random().toString(36).slice(-12)); // Generate random password if not provided
            // Create user in local database
            const user = userRepository.create({
                email: userData.email,
                password_hash: passwordHash,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                display_name: userData.display_name || `${userData.first_name} ${userData.last_name}`,
                phone: userData.phone,
                is_active: true,
                email_verified: false,
                metadata: {
                    created_via_admin: true,
                    created_by: createdBy,
                },
            });
            await userRepository.save(user);
            // Assign roles
            if (userData.roles && userData.roles.length > 0) {
                await this.assignRoles(user.id, userData.roles, createdBy);
            }
            else {
                // Assign default 'user' role
                const userRole = await roleRepository.findOne({
                    where: { name: 'user' },
                });
                if (userRole) {
                    await this.assignRoles(user.id, ['user'], createdBy);
                }
            }
            // Create audit log
            await this.createAuditLog({
                user_id: createdBy,
                action: 'CREATE_USER',
                resource_type: 'user',
                resource_id: user.id,
                changes: {
                    created: {
                        email: user.email,
                        roles: userData.roles || ['user'],
                    },
                },
            });
            logger_1.logger.info('User created successfully:', {
                userId: user.id,
                email: user.email,
            });
            return this.getUserById(user.id);
        }
        catch (error) {
            logger_1.logger.error('Failed to create user:', error);
            throw error;
        }
    }
    async updateUser(userId, userData, updatedBy) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: userId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const changes = {};
        // Check for email conflicts
        if (userData.email && userData.email !== user.email) {
            const existingUser = await userRepository.findOne({
                where: { email: userData.email },
            });
            if (existingUser) {
                throw new errors_1.ConflictError('User with this email already exists');
            }
            changes.email = { from: user.email, to: userData.email };
        }
        // Update local user
        Object.assign(user, {
            email: userData.email || user.email,
            username: userData.username !== undefined ? userData.username : user.username,
            first_name: userData.first_name !== undefined ? userData.first_name : user.first_name,
            last_name: userData.last_name !== undefined ? userData.last_name : user.last_name,
            display_name: userData.display_name !== undefined ? userData.display_name : user.display_name,
            phone: userData.phone !== undefined ? userData.phone : user.phone,
            is_active: userData.is_active !== undefined ? userData.is_active : user.is_active,
        });
        await userRepository.save(user);
        // Create audit log
        if (Object.keys(changes).length > 0) {
            await this.createAuditLog({
                user_id: updatedBy,
                action: 'UPDATE_USER',
                resource_type: 'user',
                resource_id: userId,
                changes,
            });
        }
        logger_1.logger.info('User updated successfully:', { userId });
        return this.getUserById(userId);
    }
    async deleteUser(userId, deletedBy) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: userId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Soft delete
        user.deleted_at = new Date();
        user.is_active = false;
        await userRepository.save(user);
        // Create audit log
        await this.createAuditLog({
            user_id: deletedBy,
            action: 'DELETE_USER',
            resource_type: 'user',
            resource_id: userId,
            changes: {
                deleted: {
                    email: user.email,
                },
            },
        });
        logger_1.logger.info('User deleted successfully:', { userId });
    }
    async activateUser(userId, activatedBy) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: userId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        user.is_active = true;
        await userRepository.save(user);
        await this.createAuditLog({
            user_id: activatedBy,
            action: 'ACTIVATE_USER',
            resource_type: 'user',
            resource_id: userId,
        });
        logger_1.logger.info('User activated:', { userId });
        return this.getUserById(userId);
    }
    async deactivateUser(userId, deactivatedBy) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: userId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        user.is_active = false;
        await userRepository.save(user);
        await this.createAuditLog({
            user_id: deactivatedBy,
            action: 'DEACTIVATE_USER',
            resource_type: 'user',
            resource_id: userId,
        });
        logger_1.logger.info('User deactivated:', { userId });
        return this.getUserById(userId);
    }
    async getUserRoles(userId) {
        const userRoleRepository = database_1.AppDataSource.getRepository(UserRole_1.UserRole);
        const userRoles = await userRoleRepository.find({
            where: { user_id: userId },
            relations: ['role'],
        });
        return userRoles.map((ur) => ur.role);
    }
    async assignRole(userId, roleName, assignedBy) {
        const roleRepository = database_1.AppDataSource.getRepository(Role_1.Role);
        const userRoleRepository = database_1.AppDataSource.getRepository(UserRole_1.UserRole);
        const role = await roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            throw new errors_1.NotFoundError(`Role '${roleName}' not found`);
        }
        // Check if already assigned
        const existingUserRole = await userRoleRepository.findOne({
            where: { user_id: userId, role_id: role.id },
        });
        if (existingUserRole) {
            throw new errors_1.ConflictError('User already has this role');
        }
        const userRole = userRoleRepository.create({
            user_id: userId,
            role_id: role.id,
            assigned_by: assignedBy,
        });
        await userRoleRepository.save(userRole);
        await this.createAuditLog({
            user_id: assignedBy,
            action: 'ASSIGN_ROLE',
            resource_type: 'user',
            resource_id: userId,
            changes: {
                role: roleName,
            },
        });
        logger_1.logger.info('Role assigned:', { userId, roleName });
    }
    async removeRole(userId, roleId, removedBy) {
        const userRoleRepository = database_1.AppDataSource.getRepository(UserRole_1.UserRole);
        const userRole = await userRoleRepository.findOne({
            where: { user_id: userId, role_id: roleId },
            relations: ['role'],
        });
        if (!userRole) {
            throw new errors_1.NotFoundError('User does not have this role');
        }
        await userRoleRepository.remove(userRole);
        await this.createAuditLog({
            user_id: removedBy,
            action: 'REMOVE_ROLE',
            resource_type: 'user',
            resource_id: userId,
            changes: {
                role: userRole.role.name,
            },
        });
        logger_1.logger.info('Role removed:', { userId, roleId });
    }
    async assignRoles(userId, roleNames, assignedBy) {
        const roleRepository = database_1.AppDataSource.getRepository(Role_1.Role);
        const userRoleRepository = database_1.AppDataSource.getRepository(UserRole_1.UserRole);
        for (const roleName of roleNames) {
            const role = await roleRepository.findOne({ where: { name: roleName } });
            if (role) {
                const userRole = userRoleRepository.create({
                    user_id: userId,
                    role_id: role.id,
                    assigned_by: assignedBy,
                });
                await userRoleRepository.save(userRole);
            }
        }
    }
    async createAuditLog(data) {
        const auditLogRepository = database_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
        const auditLog = auditLogRepository.create(data);
        await auditLogRepository.save(auditLog);
    }
    mapToUserDetailResponse(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            display_name: user.display_name,
            phone: user.phone,
            roles: user.user_roles?.map((ur) => ({
                id: ur.role.id,
                name: ur.role.name,
                description: ur.role.description,
            })) || [],
            is_active: user.is_active,
            email_verified: user.email_verified,
            last_login_at: user.last_login_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map