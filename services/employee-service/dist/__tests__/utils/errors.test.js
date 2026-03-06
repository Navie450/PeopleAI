"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../utils/errors");
describe('Error Classes', () => {
    describe('AppError', () => {
        it('should create error with all properties', () => {
            const error = new errors_1.AppError('Something went wrong', 500, 'INTERNAL', true, { key: 'value' });
            expect(error.message).toBe('Something went wrong');
            expect(error.statusCode).toBe(500);
            expect(error.code).toBe('INTERNAL');
            expect(error.isOperational).toBe(true);
            expect(error.details).toEqual({ key: 'value' });
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(errors_1.AppError);
            expect(error.stack).toBeDefined();
        });
        it('should default isOperational to true', () => {
            const error = new errors_1.AppError('msg', 400, 'CODE');
            expect(error.isOperational).toBe(true);
        });
        it('should allow non-operational errors', () => {
            const error = new errors_1.AppError('msg', 500, 'CODE', false);
            expect(error.isOperational).toBe(false);
        });
    });
    describe('ValidationError', () => {
        it('should create 400 error with VALIDATION_ERROR code', () => {
            const error = new errors_1.ValidationError('Invalid input', { field: 'email' });
            expect(error.statusCode).toBe(400);
            expect(error.code).toBe('VALIDATION_ERROR');
            expect(error.message).toBe('Invalid input');
            expect(error.details).toEqual({ field: 'email' });
            expect(error.isOperational).toBe(true);
        });
        it('should work without details', () => {
            const error = new errors_1.ValidationError('Bad data');
            expect(error.details).toBeUndefined();
        });
    });
    describe('UnauthorizedError', () => {
        it('should create 401 error with default message', () => {
            const error = new errors_1.UnauthorizedError();
            expect(error.statusCode).toBe(401);
            expect(error.code).toBe('UNAUTHORIZED');
            expect(error.message).toBe('Unauthorized');
        });
        it('should accept custom message', () => {
            const error = new errors_1.UnauthorizedError('Token expired');
            expect(error.message).toBe('Token expired');
        });
    });
    describe('ForbiddenError', () => {
        it('should create 403 error with default message', () => {
            const error = new errors_1.ForbiddenError();
            expect(error.statusCode).toBe(403);
            expect(error.code).toBe('FORBIDDEN');
            expect(error.message).toBe('Forbidden: Insufficient permissions');
        });
        it('should accept custom message', () => {
            const error = new errors_1.ForbiddenError('No access');
            expect(error.message).toBe('No access');
        });
    });
    describe('NotFoundError', () => {
        it('should create 404 error with default message', () => {
            const error = new errors_1.NotFoundError();
            expect(error.statusCode).toBe(404);
            expect(error.code).toBe('NOT_FOUND');
            expect(error.message).toBe('Resource not found');
        });
        it('should accept custom message', () => {
            const error = new errors_1.NotFoundError('Employee not found');
            expect(error.message).toBe('Employee not found');
        });
    });
    describe('ConflictError', () => {
        it('should create 409 error', () => {
            const error = new errors_1.ConflictError('Email already in use');
            expect(error.statusCode).toBe(409);
            expect(error.code).toBe('CONFLICT');
            expect(error.message).toBe('Email already in use');
        });
    });
});
//# sourceMappingURL=errors.test.js.map