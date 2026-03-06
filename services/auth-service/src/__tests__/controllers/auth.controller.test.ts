jest.mock('../../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('../../config/environment', () => ({
  env: { NODE_ENV: 'test' },
}));

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  refreshAccessToken: jest.fn(),
  changePassword: jest.fn(),
  logout: jest.fn(),
};

jest.mock('../../services/auth.service', () => ({
  authService: mockAuthService,
}));

import * as controller from '../../controllers/auth.controller';

const createReq = (overrides: Record<string, any> = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: undefined as any,
  ...overrides,
});

const createRes = () => {
  const res: any = {
    _json: null,
    _status: 200,
    status: jest.fn().mockImplementation(function (this: any, code: number) {
      this._status = code;
      return this;
    }),
    json: jest.fn().mockImplementation(function (this: any, data: any) {
      this._json = data;
      return this;
    }),
  };
  return res;
};

const next = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Controller', () => {
  describe('register', () => {
    it('should return 201 with tokens and user', async () => {
      const mockUser = {
        id: 'user-uuid',
        email: 'test@example.com',
        username: null,
        first_name: 'John',
        last_name: 'Doe',
        display_name: 'John Doe',
        roles: ['user'],
        is_active: true,
        email_verified: false,
        last_login_at: null,
        created_at: new Date(),
      };
      mockAuthService.register.mockResolvedValue({
        tokens: { access_token: 'at', refresh_token: 'rt', expires_in: 900, token_type: 'Bearer' },
        user: mockUser,
      });

      const req = createReq({
        body: { email: 'test@example.com', password: 'StrongP@ss1!' },
      });
      const res = createRes();

      await controller.register(req as any, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res._json.success).toBe(true);
      expect(res._json.data.tokens.access_token).toBe('at');
      expect(res._json.data.user.email).toBe('test@example.com');
    });

    it('should call next with error for invalid body', async () => {
      const req = createReq({ body: { email: 'bad' } });
      const res = createRes();

      await controller.register(req as any, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('login', () => {
    it('should return 200 with tokens and user', async () => {
      const mockUser = {
        id: 'user-uuid',
        email: 'test@example.com',
        roles: ['user'],
        is_active: true,
        email_verified: true,
        created_at: new Date(),
      };
      mockAuthService.login.mockResolvedValue({
        tokens: { access_token: 'at', refresh_token: 'rt', expires_in: 900, token_type: 'Bearer' },
        user: mockUser,
      });

      const req = createReq({
        body: { email: 'test@example.com', password: 'password1' },
      });
      const res = createRes();

      await controller.login(req as any, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res._json.success).toBe(true);
      expect(res._json.data.tokens).toBeDefined();
    });

    it('should call next on login failure', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      const req = createReq({
        body: { email: 'test@example.com', password: 'wrong' },
      });
      const res = createRes();

      await controller.login(req as any, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('refreshToken', () => {
    it('should return 200 with new tokens', async () => {
      mockAuthService.refreshAccessToken.mockResolvedValue({
        access_token: 'new-at',
        refresh_token: 'rt',
        expires_in: 900,
        token_type: 'Bearer',
      });

      const req = createReq({
        body: { refresh_token: 'valid-rt' },
      });
      const res = createRes();

      await controller.refreshToken(req as any, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res._json.success).toBe(true);
    });

    it('should call next with error for missing refresh_token', async () => {
      const req = createReq({ body: {} });
      const res = createRes();

      await controller.refreshToken(req as any, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('changePassword', () => {
    it('should return 200 on successful password change', async () => {
      mockAuthService.changePassword.mockResolvedValue(undefined);

      const req = createReq({
        body: { old_password: 'OldP@ss1!', new_password: 'NewP@ss1!' },
        user: { id: 'user-uuid', email: 'test@example.com' },
      });
      const res = createRes();

      await controller.changePassword(req as any, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res._json.success).toBe(true);
      expect(res._json.message).toContain('changed');
    });

    it('should call next if user not authenticated', async () => {
      const req = createReq({
        body: { old_password: 'old', new_password: 'NewP@ss1!' },
        user: undefined,
      });
      const res = createRes();

      await controller.changePassword(req as any, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('logout', () => {
    it('should return 200 for authenticated user', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const req = createReq({
        user: { id: 'user-uuid', email: 'test@example.com' },
      });
      const res = createRes();

      await controller.logout(req as any, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res._json.success).toBe(true);
    });

    it('should return 200 even without authenticated user', async () => {
      const req = createReq({ user: undefined });
      const res = createRes();

      await controller.logout(req as any, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res._json.success).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('should return 200 with user data', async () => {
      const req = createReq({
        user: {
          id: 'user-uuid',
          email: 'test@example.com',
          roles: ['user'],
          is_active: true,
          email_verified: true,
          created_at: new Date(),
        },
      });
      const res = createRes();

      await controller.getCurrentUser(req as any, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res._json.success).toBe(true);
      expect(res._json.data.email).toBe('test@example.com');
    });

    it('should call next if not authenticated', async () => {
      const req = createReq({ user: undefined });
      const res = createRes();

      await controller.getCurrentUser(req as any, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
