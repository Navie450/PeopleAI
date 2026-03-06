"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const error_middleware_1 = require("../../middleware/error.middleware");
const errors_1 = require("../../utils/errors");
const mock_express_1 = require("../helpers/mock-express");
jest.mock('../../utils/logger', () => ({
    logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));
jest.mock('../../config/environment', () => ({
    env: { NODE_ENV: 'test' },
}));
describe('Error Middleware', () => {
    describe('errorHandler', () => {
        it('should handle ZodError as validation error', () => {
            const zodError = new zod_1.ZodError([
                {
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    path: ['email'],
                    message: 'Expected string, received number',
                },
            ]);
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            (0, error_middleware_1.errorHandler)(zodError, req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res._json).toMatchObject({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                },
            });
            expect(res._json.error.details).toBeDefined();
        });
        it('should handle AppError with correct status code', () => {
            const error = new errors_1.NotFoundError('Employee not found');
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            (0, error_middleware_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res._json).toMatchObject({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Employee not found',
                },
            });
        });
        it('should handle ValidationError with details', () => {
            const error = new errors_1.ValidationError('Bad input', [{ field: 'name', message: 'required' }]);
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            (0, error_middleware_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res._json.error.details).toBeDefined();
        });
        it('should handle unknown errors as 500', () => {
            const error = new Error('Something broke');
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            (0, error_middleware_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res._json).toMatchObject({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                },
            });
        });
        it('should include timestamp in error response', () => {
            const error = new errors_1.AppError('test', 500, 'TEST');
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            (0, error_middleware_1.errorHandler)(error, req, res, next);
            expect(res._json.error.timestamp).toBeDefined();
        });
    });
    describe('notFoundHandler', () => {
        it('should return 404 with route info', () => {
            const req = (0, mock_express_1.createMockRequest)({ method: 'GET', path: '/unknown' });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            (0, error_middleware_1.notFoundHandler)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res._json).toMatchObject({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Route GET /unknown not found',
                },
            });
        });
    });
});
//# sourceMappingURL=error.middleware.test.js.map