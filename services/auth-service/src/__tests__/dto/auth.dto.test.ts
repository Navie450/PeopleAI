import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../../dto/auth.dto';

describe('Auth DTOs', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'StrongP@ss1',
      });
      expect(result.success).toBe(true);
    });

    it('should accept optional first_name and last_name', () => {
      const result = registerSchema.parse({
        email: 'test@example.com',
        password: 'StrongP@ss1',
        first_name: 'John',
        last_name: 'Doe',
      });
      expect(result.first_name).toBe('John');
      expect(result.last_name).toBe('Doe');
    });

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'StrongP@ss1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const result = registerSchema.safeParse({ password: 'StrongP@ss1' });
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const result = registerSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'bad-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshTokenSchema', () => {
    it('should validate valid refresh token', () => {
      const result = refreshTokenSchema.safeParse({
        refresh_token: 'some-token-value',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty refresh token', () => {
      const result = refreshTokenSchema.safeParse({
        refresh_token: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing refresh token', () => {
      const result = refreshTokenSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should validate valid password change data', () => {
      const result = changePasswordSchema.safeParse({
        old_password: 'OldP@ss1',
        new_password: 'NewStrongP@ss1',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty old_password', () => {
      const result = changePasswordSchema.safeParse({
        old_password: '',
        new_password: 'NewStrongP@ss1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject new_password shorter than 8 characters', () => {
      const result = changePasswordSchema.safeParse({
        old_password: 'OldP@ss1',
        new_password: 'short',
      });
      expect(result.success).toBe(false);
    });
  });
});
