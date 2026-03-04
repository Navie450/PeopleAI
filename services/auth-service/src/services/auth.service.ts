import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { UserRole } from '../entities/UserRole';
import { logger } from '../utils/logger';
import {
  UnauthorizedError,
  ConflictError,
  ValidationError,
  NotFoundError,
} from '../utils/errors';
import { AuthTokenResponse } from '../dto/auth.dto';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/password';

class AuthService {
  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<{
    tokens: AuthTokenResponse;
    user: User;
  }> {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);
    const userRoleRepository = AppDataSource.getRepository(UserRole);

    // Check if email already exists
    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      throw new ValidationError(
        `Password does not meet requirements: ${passwordValidation.errors.join(', ')}`
      );
    }

    try {
      // Hash password
      const passwordHash = await hashPassword(password);

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
      const accessToken = generateAccessToken(userWithRoles.id, userWithRoles.email, roles);
      const refreshToken = generateRefreshToken(userWithRoles.id, userWithRoles.email);

      logger.info('User registered successfully:', {
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
    } catch (error) {
      logger.error('Failed to register user:', error);
      throw error;
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    tokens: AuthTokenResponse;
    user: User;
  }> {
    const userRepository = AppDataSource.getRepository(User);

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
        throw new UnauthorizedError('Invalid email or password');
      }

      if (!user.is_active) {
        throw new UnauthorizedError('User account is inactive');
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Extract roles
      const roles = user.user_roles?.map((ur) => ur.role.name) || [];
      user.roles = roles;

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email, roles);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Update last login
      await this.updateLastLogin(user.id);

      logger.info('User logged in successfully:', {
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
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthTokenResponse> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Get user from database
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.user_roles', 'user_roles')
        .leftJoinAndSelect('user_roles.role', 'role')
        .where('user.id = :userId', { userId: payload.sub })
        .andWhere('user.deleted_at IS NULL')
        .getOne();

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      if (!user.is_active) {
        throw new UnauthorizedError('User account is inactive');
      }

      // Extract roles
      const roles = user.user_roles?.map((ur) => ur.role.name) || [];

      // Generate new access token
      const accessToken = generateAccessToken(user.id, user.email, roles);

      logger.info('Access token refreshed successfully:', { userId: user.id });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 900, // 15 minutes
        token_type: 'Bearer',
      };
    } catch (error) {
      logger.error('Failed to refresh token:', error);
      throw new UnauthorizedError('Failed to refresh authentication');
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);

    try {
      // Get user
      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Verify old password
      const isPasswordValid = await verifyPassword(oldPassword, user.password_hash);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid current password');
      }

      // Validate new password strength
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.valid) {
        throw new ValidationError(
          `Password does not meet requirements: ${passwordValidation.errors.join(', ')}`
        );
      }

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update password
      user.password_hash = passwordHash;
      await userRepository.save(user);

      logger.info('Password changed successfully:', { userId });
    } catch (error) {
      logger.error('Failed to change password:', error);
      throw error;
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      // In a production system, you might want to:
      // 1. Invalidate the refresh token by storing it in a blacklist
      // 2. Clear any session data
      // For now, we'll just log the logout
      logger.info('User logged out:', { userId });
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.update(userId, {
        last_login_at: new Date(),
      });
    } catch (error) {
      logger.error('Failed to update last login:', error);
    }
  }
}

export const authService = new AuthService();
