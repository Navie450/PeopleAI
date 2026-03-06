"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('../../utils/logger', () => ({
    logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));
jest.mock('../../config/environment', () => ({
    env: {
        JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters-long',
        JWT_REFRESH_SECRET: 'test-refresh-secret-that-is-at-least-32-characters',
        JWT_ACCESS_TOKEN_EXPIRY: '15m',
        JWT_REFRESH_TOKEN_EXPIRY: '7d',
    },
}));
const jwt_1 = require("../../utils/jwt");
const errors_1 = require("../../utils/errors");
const accessSecret = 'test-jwt-secret-that-is-at-least-32-characters-long';
const refreshSecret = 'test-refresh-secret-that-is-at-least-32-characters';
describe('JWT Utils (Auth Service)', () => {
    describe('generateAccessToken', () => {
        it('should generate a valid JWT access token', () => {
            const token = (0, jwt_1.generateAccessToken)('user-123', 'test@example.com', ['user']);
            expect(typeof token).toBe('string');
            const decoded = jsonwebtoken_1.default.verify(token, accessSecret, {
                issuer: 'auth-service',
                audience: 'auth-service-api',
            });
            expect(decoded.sub).toBe('user-123');
            expect(decoded.email).toBe('test@example.com');
            expect(decoded.roles).toEqual(['user']);
        });
    });
    describe('generateRefreshToken', () => {
        it('should generate a valid JWT refresh token', () => {
            const token = (0, jwt_1.generateRefreshToken)('user-123', 'test@example.com');
            expect(typeof token).toBe('string');
            const decoded = jsonwebtoken_1.default.verify(token, refreshSecret, {
                issuer: 'auth-service',
                audience: 'auth-service-api',
            });
            expect(decoded.sub).toBe('user-123');
            expect(decoded.email).toBe('test@example.com');
            expect(decoded.type).toBe('refresh');
        });
    });
    describe('verifyAccessToken', () => {
        it('should verify and return payload for valid token', () => {
            const token = (0, jwt_1.generateAccessToken)('user-123', 'test@example.com', ['admin']);
            const payload = (0, jwt_1.verifyAccessToken)(token);
            expect(payload.sub).toBe('user-123');
            expect(payload.email).toBe('test@example.com');
            expect(payload.roles).toEqual(['admin']);
        });
        it('should throw UnauthorizedError for expired token', () => {
            const token = jsonwebtoken_1.default.sign({ sub: 'user-123', email: 'test@example.com', roles: [] }, accessSecret, { expiresIn: '0s', issuer: 'auth-service', audience: 'auth-service-api' });
            expect(() => (0, jwt_1.verifyAccessToken)(token)).toThrow(errors_1.UnauthorizedError);
            expect(() => (0, jwt_1.verifyAccessToken)(token)).toThrow('Token has expired');
        });
        it('should throw UnauthorizedError for invalid token', () => {
            expect(() => (0, jwt_1.verifyAccessToken)('garbage')).toThrow(errors_1.UnauthorizedError);
        });
        it('should throw UnauthorizedError for wrong secret', () => {
            const token = jsonwebtoken_1.default.sign({ sub: 'user-123', email: 'test@example.com', roles: [] }, 'wrong-secret-which-is-32-chars-long!!', { expiresIn: '15m', issuer: 'auth-service', audience: 'auth-service-api' });
            expect(() => (0, jwt_1.verifyAccessToken)(token)).toThrow(errors_1.UnauthorizedError);
        });
    });
    describe('verifyRefreshToken', () => {
        it('should verify and return payload for valid refresh token', () => {
            const token = (0, jwt_1.generateRefreshToken)('user-123', 'test@example.com');
            const payload = (0, jwt_1.verifyRefreshToken)(token);
            expect(payload.sub).toBe('user-123');
            expect(payload.email).toBe('test@example.com');
            expect(payload.type).toBe('refresh');
        });
        it('should throw UnauthorizedError for expired refresh token', () => {
            const token = jsonwebtoken_1.default.sign({ sub: 'user-123', email: 'test@example.com', type: 'refresh' }, refreshSecret, { expiresIn: '0s', issuer: 'auth-service', audience: 'auth-service-api' });
            expect(() => (0, jwt_1.verifyRefreshToken)(token)).toThrow(errors_1.UnauthorizedError);
        });
        it('should throw UnauthorizedError for wrong token type', () => {
            const token = jsonwebtoken_1.default.sign({ sub: 'user-123', email: 'test@example.com', type: 'access' }, refreshSecret, { expiresIn: '7d', issuer: 'auth-service', audience: 'auth-service-api' });
            expect(() => (0, jwt_1.verifyRefreshToken)(token)).toThrow(errors_1.UnauthorizedError);
        });
        it('should throw UnauthorizedError for invalid token', () => {
            expect(() => (0, jwt_1.verifyRefreshToken)('invalid')).toThrow(errors_1.UnauthorizedError);
        });
    });
    describe('extractTokenFromHeader', () => {
        it('should extract token from valid Bearer header', () => {
            expect((0, jwt_1.extractTokenFromHeader)('Bearer mytoken123')).toBe('mytoken123');
        });
        it('should return null for missing header', () => {
            expect((0, jwt_1.extractTokenFromHeader)(undefined)).toBeNull();
        });
        it('should return null for empty header', () => {
            expect((0, jwt_1.extractTokenFromHeader)('')).toBeNull();
        });
        it('should return null for non-Bearer scheme', () => {
            expect((0, jwt_1.extractTokenFromHeader)('Basic abc')).toBeNull();
        });
        it('should return null for malformed header', () => {
            expect((0, jwt_1.extractTokenFromHeader)('Bearer')).toBeNull();
        });
    });
});
//# sourceMappingURL=jwt.test.js.map