"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const environment_1 = require("../config/environment");
const errorHandler = (err, req, res, _next) => {
    logger_1.logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        requestId: req.requestId,
        path: req.path,
        method: req.method,
    });
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const validationError = new errors_1.ValidationError('Validation failed', err.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
        })));
        return sendErrorResponse(res, validationError);
    }
    // Handle known application errors
    if (err instanceof errors_1.AppError) {
        return sendErrorResponse(res, err);
    }
    // Handle unknown errors
    const statusCode = 500;
    const response = {
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: environment_1.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
            timestamp: new Date().toISOString(),
        },
    };
    // Include stack trace in development
    if (environment_1.env.NODE_ENV === 'development') {
        response.error.details = {
            stack: err.stack,
        };
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const sendErrorResponse = (res, err) => {
    const response = {
        success: false,
        error: {
            code: err.code,
            message: err.message,
            timestamp: new Date().toISOString(),
        },
    };
    if (err.details) {
        response.error.details = err.details;
    }
    res.status(err.statusCode).json(response);
};
const notFoundHandler = (req, res, _next) => {
    const response = {
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
            timestamp: new Date().toISOString(),
        },
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map