jest.mock('../../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('../../config/environment', () => ({
  env: {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters-long',
    JWT_REFRESH_SECRET: 'test-refresh-secret-that-is-at-least-32-characters',
    JWT_ACCESS_TOKEN_EXPIRY: '15m',
    JWT_REFRESH_TOKEN_EXPIRY: '7d',
  },
}));

const mockUserRepo = {
  findOne: jest.fn(),
  create: jest.fn((data: any) => ({ id: 'user-uuid', ...data })),
  save: jest.fn((entity: any) => Promise.resolve(entity)),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  createQueryBuilder: jest.fn(),
};

const mockRoleRepo = {
  findOne: jest.fn(),
};

const mockUserRoleRepo = {
  create: jest.fn((data: any) => data),
  save: jest.fn((entity: any) => Promise.resolve(entity)),
};

const mockQb: Record<string, jest.Mock> = {};
['leftJoinAndSelect', 'where', 'andWhere'].forEach(m => {
  mockQb[m] = jest.fn().mockReturnValue(mockQb);
});
mockQb.getOne = jest.fn();

mockUserRepo.createQueryBuilder.mockReturnValue(mockQb);

jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn((entity: { name: string }) => {
      if (entity.name === 'User') return mockUserRepo;
      if (entity.name === 'Role') return mockRoleRepo;
      if (entity.name === 'UserRole') return mockUserRoleRepo;
      return mockUserRepo;
    }),
  },
}));

import { authService } from '../../services/auth.service';
import { ConflictError, UnauthorizedError, NotFoundError, ValidationError } from '../../utils/errors';
import * as passwordUtils from '../../utils/password';

beforeEach(() => {
  jest.clearAllMocks();
  mockUserRepo.createQueryBuilder.mockReturnValue(mockQb);
  // Reset chain methods
  ['leftJoinAndSelect', 'where', 'andWhere'].forEach(m => {
    mockQb[m] = jest.fn().mockReturnValue(mockQb);
  });
});

describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      mockUserRepo.findOne.mockResolvedValue(null); // no existing user
      mockRoleRepo.findOne.mockResolvedValue({ id: 'role-id', name: 'user' });
      const createdUser = {
        id: 'user-uuid',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        display_name: 'John Doe',
        is_active: true,
        email_verified: false,
        user_roles: [{ role: { name: 'user' } }],
        roles: ['user'],
      };
      mockUserRepo.create.mockReturnValue(createdUser);
      mockUserRepo.save.mockResolvedValue(createdUser);
      mockQb.getOne.mockResolvedValue(createdUser);

      const result = await authService.register('test@example.com', 'StrongP@ss1!', 'John', 'Doe');

      expect(result.tokens.access_token).toBeDefined();
      expect(result.tokens.refresh_token).toBeDefined();
      expect(result.tokens.token_type).toBe('Bearer');
      expect(result.tokens.expires_in).toBe(900);
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw ConflictError if email exists', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 'existing-user', email: 'test@example.com' });

      await expect(
        authService.register('test@example.com', 'StrongP@ss1!')
      ).rejects.toThrow(ConflictError);
    });

    it('should throw ValidationError for weak password', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        authService.register('test@example.com', 'weak')
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const passwordHash = await passwordUtils.hashPassword('StrongP@ss1!');
      const user = {
        id: 'user-uuid',
        email: 'test@example.com',
        password_hash: passwordHash,
        is_active: true,
        user_roles: [{ role: { name: 'user' } }],
        roles: [],
      };
      mockQb.getOne.mockResolvedValue(user);

      const result = await authService.login('test@example.com', 'StrongP@ss1!');

      expect(result.tokens.access_token).toBeDefined();
      expect(result.tokens.refresh_token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedError for non-existent user', async () => {
      mockQb.getOne.mockResolvedValue(null);

      await expect(
        authService.login('nonexistent@example.com', 'password')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for inactive user', async () => {
      mockQb.getOne.mockResolvedValue({
        id: 'user-uuid',
        email: 'test@example.com',
        is_active: false,
        password_hash: 'hash',
      });

      await expect(
        authService.login('test@example.com', 'password')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for wrong password', async () => {
      const passwordHash = await passwordUtils.hashPassword('CorrectP@ss1!');
      mockQb.getOne.mockResolvedValue({
        id: 'user-uuid',
        email: 'test@example.com',
        is_active: true,
        password_hash: passwordHash,
        user_roles: [],
      });

      await expect(
        authService.login('test@example.com', 'WrongP@ssword1!')
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('refreshAccessToken', () => {
    it('should generate new access token from valid refresh token', async () => {
      // Generate a real refresh token
      const jwt = require('jsonwebtoken');
      const refreshToken = jwt.sign(
        { sub: 'user-uuid', email: 'test@example.com', type: 'refresh' },
        'test-refresh-secret-that-is-at-least-32-characters',
        { expiresIn: '7d', issuer: 'auth-service', audience: 'auth-service-api' }
      );

      mockQb.getOne.mockResolvedValue({
        id: 'user-uuid',
        email: 'test@example.com',
        is_active: true,
        user_roles: [{ role: { name: 'user' } }],
      });

      const result = await authService.refreshAccessToken(refreshToken);

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBe(refreshToken);
      expect(result.token_type).toBe('Bearer');
    });

    it('should throw UnauthorizedError for invalid refresh token', async () => {
      await expect(
        authService.refreshAccessToken('invalid-token')
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const currentHash = await passwordUtils.hashPassword('OldP@ssw0rd!');
      mockUserRepo.findOne.mockResolvedValue({
        id: 'user-uuid',
        password_hash: currentHash,
      });

      await expect(
        authService.changePassword('user-uuid', 'OldP@ssw0rd!', 'NewP@ssw0rd!')
      ).resolves.toBeUndefined();

      expect(mockUserRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        authService.changePassword('nonexistent', 'old', 'NewP@ssw0rd!')
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw UnauthorizedError for wrong old password', async () => {
      const currentHash = await passwordUtils.hashPassword('CorrectP@ss!1');
      mockUserRepo.findOne.mockResolvedValue({
        id: 'user-uuid',
        password_hash: currentHash,
      });

      await expect(
        authService.changePassword('user-uuid', 'WrongP@ss!1', 'NewP@ssw0rd!')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw ValidationError for weak new password', async () => {
      const currentHash = await passwordUtils.hashPassword('OldP@ssw0rd!');
      mockUserRepo.findOne.mockResolvedValue({
        id: 'user-uuid',
        password_hash: currentHash,
      });

      await expect(
        authService.changePassword('user-uuid', 'OldP@ssw0rd!', 'weak')
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('logout', () => {
    it('should complete without error', async () => {
      await expect(authService.logout('user-uuid')).resolves.toBeUndefined();
    });
  });
});
