"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const environment_1 = require("./config/environment");
const logger_1 = require("./utils/logger");
const security_middleware_1 = require("./middleware/security.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const crypto_1 = require("crypto");
const routes_1 = __importDefault(require("./routes"));
const createApp = () => {
    const app = (0, express_1.default)();
    // Request ID middleware
    app.use((req, _res, next) => {
        req.requestId = (0, crypto_1.randomUUID)();
        next();
    });
    // Security middleware
    app.use(security_middleware_1.helmetConfig);
    app.use(security_middleware_1.corsConfig);
    app.use(security_middleware_1.rateLimiter);
    // Body parsing middleware
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Sanitization middleware
    app.use(security_middleware_1.sanitize);
    // Request logging
    app.use((req, _res, next) => {
        logger_1.logger.info(`${req.method} ${req.path}`, {
            requestId: req.requestId,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        });
        next();
    });
    // API routes
    app.use(environment_1.env.API_PREFIX, routes_1.default);
    // 404 handler
    app.use(error_middleware_1.notFoundHandler);
    // Global error handler (must be last)
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map