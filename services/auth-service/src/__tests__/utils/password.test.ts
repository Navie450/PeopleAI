jest.mock('../../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

import { hashPassword, verifyPassword, validatePasswordStrength } from '../../utils/password';

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword('MyP@ssw0rd!');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('MyP@ssw0rd!');
      expect(hash.startsWith('$2b$')).toBe(true);
    });

    it('should produce different hashes for same password', async () => {
      const hash1 = await hashPassword('MyP@ssw0rd!');
      const hash2 = await hashPassword('MyP@ssw0rd!');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const hash = await hashPassword('MyP@ssw0rd!');
      const result = await verifyPassword('MyP@ssw0rd!', hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hash = await hashPassword('MyP@ssw0rd!');
      const result = await verifyPassword('WrongPassword1!', hash);
      expect(result).toBe(false);
    });

    it('should return false for invalid hash', async () => {
      const result = await verifyPassword('password', 'not-a-valid-hash');
      expect(result).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept a strong password', () => {
      const result = validatePasswordStrength('MyP@ssw0rd!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePasswordStrength('Ab1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase letter', () => {
      const result = validatePasswordStrength('mypassw0rd!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = validatePasswordStrength('MYPASSW0RD!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = validatePasswordStrength('MyPassword!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = validatePasswordStrength('MyPassw0rd');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should return multiple errors for very weak password', () => {
      const result = validatePasswordStrength('abc');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
