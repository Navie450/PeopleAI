"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const mock_express_1 = require("../helpers/mock-express");
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
const secret = 'test-jwt-secret-that-is-at-least-32-characters-long';
const createToken = (payload = {}) => jsonwebtoken_1.default.sign({ sub: 'user-123', email: 'test@example.com', roles: ['user'], ...payload }, secret, { expiresIn: '15m', issuer: 'auth-service', audience: 'auth-service-api' });
describe('Auth Middleware', () => {
    describe('authenticate', () => {
        it('should set req.user for valid token', async () => {
            const token = createToken();
            const req = (0, mock_express_1.createMockRequest)({
                headers: { authorization: `Bearer ${token}` },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await (0, auth_middleware_1.authenticate)(req, res, next);
            expect(next).toHaveBeenCalledWith();
            expect(req.user).toBeDefined();
            expect(req.user.id).toBe('user-123');
            expect(req.user.email).toBe('test@example.com');
            expect(req.user.roles).toEqual(['user']);
        });
        it('should call next with error if no token', async () => {
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await (0, auth_middleware_1.authenticate)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: 'No authentication token provided',
            }));
        });
        it('should call next with error for invalid token', async () => {
            const req = (0, mock_express_1.createMockRequest)({
                headers: { authorization: 'Bearer invalid-token' },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await (0, auth_middleware_1.authenticate)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401,
            }));
        });
    });
    describe('optionalAuthenticate', () => {
        it('should set req.user for valid token', async () => {
            const token = createToken();
            const req = (0, mock_express_1.createMockRequest)({
                headers: { authorization: `Bearer ${token}` },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await (0, auth_middleware_1.optionalAuthenticate)(req, res, next);
            expect(next).toHaveBeenCalledWith();
            expect(req.user).toBeDefined();
            expect(req.user.id).toBe('user-123');
        });
        it('should call next without error if no token', async () => {
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await (0, auth_middleware_1.optionalAuthenticate)(req, res, next);
            expect(next).toHaveBeenCalledWith();
            expect(req.user).toBeUndefined();
        });
        it('should call next without error for invalid token', async () => {
            const req = (0, mock_express_1.createMockRequest)({
                headers: { authorization: 'Bearer bad-token' },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await (0, auth_middleware_1.optionalAuthenticate)(req, res, next);
            expect(next).toHaveBeenCalledWith();
            expect(req.user).toBeUndefined();
        });
    });
    describe('requireRole', () => {
        it('should call next if user has required role', () => {
            const middleware = (0, auth_middleware_1.requireRole)('admin');
            const req = (0, mock_express_1.createMockRequest)({
                user: { id: 'user-1', email: 'a@b.com', roles: ['admin', 'user'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });
        it('should call next with ForbiddenError if role missing', () => {
            const middleware = (0, auth_middleware_1.requireRole)('admin');
            const req = (0, mock_express_1.createMockRequest)({
                user: { id: 'user-1', email: 'a@b.com', roles: ['user'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 403,
            }));
        });
        it('should call next with UnauthorizedError if no user', () => {
            const middleware = (0, auth_middleware_1.requireRole)('admin');
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401,
            }));
        });
        it('should accept any of multiple roles', () => {
            const middleware = (0, auth_middleware_1.requireRole)('admin', 'manager');
            const req = (0, mock_express_1.createMockRequest)({
                user: { id: 'user-1', email: 'a@b.com', roles: ['manager'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });
    });
    describe('requireAdmin', () => {
        it('should allow admin role', () => {
            const req = (0, mock_express_1.createMockRequest)({
                user: { id: 'user-1', email: 'a@b.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            (0, auth_middleware_1.requireAdmin)(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });
        it('should deny non-admin role', () => {
            const req = (0, mock_express_1.createMockRequest)({
                user: { id: 'user-1', email: 'a@b.com', roles: ['user'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            (0, auth_middleware_1.requireAdmin)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 403,
            }));
        });
    });
});
//# sourceMappingURL=auth.middleware.test.js.map