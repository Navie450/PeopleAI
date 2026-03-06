"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Must mock before importing
jest.mock('../../utils/logger', () => ({
    logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));
jest.mock('../../config/environment', () => ({
    env: {
        JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters-long',
        JWT_ACCESS_TOKEN_EXPIRY: '15m',
    },
}));
const jwt_1 = require("../../utils/jwt");
const errors_1 = require("../../utils/errors");
describe('JWT Utils', () => {
    const secret = 'test-jwt-secret-that-is-at-least-32-characters-long';
    const createValidToken = (payload = {}) => jsonwebtoken_1.default.sign({ sub: 'user-123', email: 'test@example.com', roles: ['user'], ...payload }, secret, { expiresIn: '15m', issuer: 'auth-service', audience: 'auth-service-api' });
    describe('verifyAccessToken', () => {
        it('should verify a valid token and return payload', () => {
            const token = createValidToken();
            const payload = (0, jwt_1.verifyAccessToken)(token);
            expect(payload.sub).toBe('user-123');
            expect(payload.email).toBe('test@example.com');
            expect(payload.roles).toEqual(['user']);
        });
        it('should throw UnauthorizedError for expired token', () => {
            const token = jsonwebtoken_1.default.sign({ sub: 'user-123', email: 'test@example.com', roles: [] }, secret, { expiresIn: '0s', issuer: 'auth-service', audience: 'auth-service-api' });
            expect(() => (0, jwt_1.verifyAccessToken)(token)).toThrow(errors_1.UnauthorizedError);
            expect(() => (0, jwt_1.verifyAccessToken)(token)).toThrow('Token has expired');
        });
        it('should throw UnauthorizedError for invalid token', () => {
            expect(() => (0, jwt_1.verifyAccessToken)('invalid.token.here')).toThrow(errors_1.UnauthorizedError);
            expect(() => (0, jwt_1.verifyAccessToken)('invalid.token.here')).toThrow('Invalid token');
        });
        it('should throw UnauthorizedError for token signed with wrong secret', () => {
            const token = jsonwebtoken_1.default.sign({ sub: 'user-123', email: 'test@example.com', roles: [] }, 'wrong-secret-that-is-also-32-chars-long', { expiresIn: '15m', issuer: 'auth-service', audience: 'auth-service-api' });
            expect(() => (0, jwt_1.verifyAccessToken)(token)).toThrow(errors_1.UnauthorizedError);
        });
    });
    describe('extractTokenFromHeader', () => {
        it('should extract token from valid Bearer header', () => {
            expect((0, jwt_1.extractTokenFromHeader)('Bearer abc123')).toBe('abc123');
        });
        it('should return null for missing header', () => {
            expect((0, jwt_1.extractTokenFromHeader)(undefined)).toBeNull();
        });
        it('should return null for empty header', () => {
            expect((0, jwt_1.extractTokenFromHeader)('')).toBeNull();
        });
        it('should return null for non-Bearer scheme', () => {
            expect((0, jwt_1.extractTokenFromHeader)('Basic abc123')).toBeNull();
        });
        it('should return null for malformed header', () => {
            expect((0, jwt_1.extractTokenFromHeader)('Bearer')).toBeNull();
            expect((0, jwt_1.extractTokenFromHeader)('Bearer a b')).toBeNull();
        });
    });
});
//# sourceMappingURL=jwt.test.js.map