import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { UserRole } from '../entities/UserRole';
import { AuditLog } from '../entities/AuditLog';
import { IsNull } from 'typeorm';
import { logger } from '../utils/logger';
import { hashPassword, validatePasswordStrength } from '../utils/password';
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../utils/errors';
import {
  CreateUserDto,
  UpdateUserDto,
  ListUsersQuery,
  UserDetailResponse,
  UserListItemResponse,
} from '../dto/user.dto';
import { PaginationMeta } from '../types';

class UserService {
  async listUsers(
    query: ListUsersQuery
  ): Promise<{ users: UserListItemResponse[]; meta: PaginationMeta }> {
    const userRepository = AppDataSource.getRepository(User);
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
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.username ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search)',
        { search: `%${query.search}%` }
      );
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

    const userResponses: UserListItemResponse[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      roles: user.user_roles?.map((ur) => ur.role.name) || [],
      is_active: user.is_active,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
    }));

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { users: userResponses, meta };
  }

  async getUserById(userId: string): Promise<UserDetailResponse> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user_roles', 'user_roles')
      .leftJoinAndSelect('user_roles.role', 'role')
      .where('user.id = :userId', { userId })
      .andWhere('user.deleted_at IS NULL')
      .getOne();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.mapToUserDetailResponse(user);
  }

  async createUser(
    userData: CreateUserDto,
    createdBy?: string
  ): Promise<UserDetailResponse> {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    // Check if email already exists
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Validate password if provided
    if (userData.password) {
      const passwordValidation = validatePasswordStrength(userData.password);
      if (!passwordValidation.valid) {
        throw new ValidationError(
          `Password does not meet requirements: ${passwordValidation.errors.join(', ')}`
        );
      }
    }

    try {
      // Hash password
      const passwordHash = userData.password
        ? await hashPassword(userData.password)
        : await hashPassword(Math.random().toString(36).slice(-12)); // Generate random password if not provided

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
      } else {
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

      logger.info('User created successfully:', {
        userId: user.id,
        email: user.email,
      });

      return this.getUserById(user.id);
    } catch (error) {
      logger.error('Failed to create user:', error);
      throw error;
    }
  }

  async updateUser(
    userId: string,
    userData: UpdateUserDto,
    updatedBy?: string
  ): Promise<UserDetailResponse> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId, deleted_at: IsNull() },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const changes: Record<string, any> = {};

    // Check for email conflicts
    if (userData.email && userData.email !== user.email) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
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

    logger.info('User updated successfully:', { userId });

    return this.getUserById(userId);
  }

  async deleteUser(userId: string, deletedBy?: string): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId, deleted_at: IsNull() },
    });

    if (!user) {
      throw new NotFoundError('User not found');
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

    logger.info('User deleted successfully:', { userId });
  }

  async activateUser(userId: string, activatedBy?: string): Promise<UserDetailResponse> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId, deleted_at: IsNull() },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.is_active = true;
    await userRepository.save(user);

    await this.createAuditLog({
      user_id: activatedBy,
      action: 'ACTIVATE_USER',
      resource_type: 'user',
      resource_id: userId,
    });

    logger.info('User activated:', { userId });

    return this.getUserById(userId);
  }

  async deactivateUser(userId: string, deactivatedBy?: string): Promise<UserDetailResponse> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId, deleted_at: IsNull() },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.is_active = false;
    await userRepository.save(user);

    await this.createAuditLog({
      user_id: deactivatedBy,
      action: 'DEACTIVATE_USER',
      resource_type: 'user',
      resource_id: userId,
    });

    logger.info('User deactivated:', { userId });

    return this.getUserById(userId);
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoleRepository = AppDataSource.getRepository(UserRole);

    const userRoles = await userRoleRepository.find({
      where: { user_id: userId },
      relations: ['role'],
    });

    return userRoles.map((ur) => ur.role);
  }

  async assignRole(
    userId: string,
    roleName: string,
    assignedBy?: string
  ): Promise<void> {
    const roleRepository = AppDataSource.getRepository(Role);
    const userRoleRepository = AppDataSource.getRepository(UserRole);

    const role = await roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundError(`Role '${roleName}' not found`);
    }

    // Check if already assigned
    const existingUserRole = await userRoleRepository.findOne({
      where: { user_id: userId, role_id: role.id },
    });

    if (existingUserRole) {
      throw new ConflictError('User already has this role');
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

    logger.info('Role assigned:', { userId, roleName });
  }

  async removeRole(
    userId: string,
    roleId: string,
    removedBy?: string
  ): Promise<void> {
    const userRoleRepository = AppDataSource.getRepository(UserRole);

    const userRole = await userRoleRepository.findOne({
      where: { user_id: userId, role_id: roleId },
      relations: ['role'],
    });

    if (!userRole) {
      throw new NotFoundError('User does not have this role');
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

    logger.info('Role removed:', { userId, roleId });
  }

  private async assignRoles(
    userId: string,
    roleNames: string[],
    assignedBy?: string
  ): Promise<void> {
    const roleRepository = AppDataSource.getRepository(Role);
    const userRoleRepository = AppDataSource.getRepository(UserRole);

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

  private async createAuditLog(data: {
    user_id?: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    changes?: Record<string, unknown>;
  }): Promise<void> {
    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    const auditLog = auditLogRepository.create(data);
    await auditLogRepository.save(auditLog);
  }

  private mapToUserDetailResponse(user: User): UserDetailResponse {
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

export const userService = new UserService();
