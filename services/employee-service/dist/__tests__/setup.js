"use strict";
// Mock logger to prevent console noise during tests
jest.mock('../utils/logger', () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));
// Mock environment variables
jest.mock('../config/environment', () => ({
    env: {
        NODE_ENV: 'test',
        PORT: 5002,
        API_PREFIX: '/api/v1',
        JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters-long',
        JWT_ACCESS_TOKEN_EXPIRY: '15m',
        CORS_ORIGIN: 'http://localhost:3000',
        RATE_LIMIT_WINDOW_MS: 900000,
        RATE_LIMIT_MAX: 100,
        LOG_LEVEL: 'error',
        LOG_FORMAT: 'simple',
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_NAME: 'test',
        DB_USER: 'test',
        DB_PASSWORD: 'test',
        DB_SSL: false,
        DB_LOGGING: false,
    },
}));
// Set test environment
process.env.NODE_ENV = 'test';
//# sourceMappingURL=setup.js.map