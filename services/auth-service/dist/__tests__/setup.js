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
        PORT: 5001,
        API_PREFIX: '/api/v1',
        JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters-long',
        JWT_REFRESH_SECRET: 'test-refresh-secret-that-is-at-least-32-characters',
        JWT_ACCESS_TOKEN_EXPIRY: '15m',
        JWT_REFRESH_TOKEN_EXPIRY: '7d',
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
process.env.NODE_ENV = 'test';
//# sourceMappingURL=setup.js.map