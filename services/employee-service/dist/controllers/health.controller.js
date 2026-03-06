"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullHealthCheck = exports.databaseHealthCheck = exports.healthCheck = void 0;
const database_1 = require("../config/database");
const environment_1 = require("../config/environment");
const logger_1 = require("../utils/logger");
const healthCheck = async (_req, res, _next) => {
    const response = {
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: environment_1.env.NODE_ENV,
            version: process.env.npm_package_version || '1.0.0',
        },
    };
    res.json(response);
};
exports.healthCheck = healthCheck;
const databaseHealthCheck = async (_req, res, next) => {
    try {
        const startTime = Date.now();
        if (!database_1.AppDataSource.isInitialized) {
            throw new Error('Database connection not initialized');
        }
        // Simple query to check database connection
        await database_1.AppDataSource.query('SELECT 1');
        const responseTime = Date.now() - startTime;
        const response = {
            success: true,
            data: {
                status: 'healthy',
                database: 'connected',
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString(),
            },
        };
        res.json(response);
    }
    catch (error) {
        logger_1.logger.error('Database health check failed:', error);
        next(error);
    }
};
exports.databaseHealthCheck = databaseHealthCheck;
const fullHealthCheck = async (_req, res, next) => {
    try {
        const checks = {
            database: 'unknown',
            server: 'unknown',
        };
        // Check database
        try {
            if (database_1.AppDataSource.isInitialized) {
                await database_1.AppDataSource.query('SELECT 1');
                checks.database = 'healthy';
            }
            else {
                checks.database = 'not_initialized';
            }
        }
        catch (error) {
            checks.database = 'unhealthy';
            logger_1.logger.error('Database check failed:', error);
        }
        // Check server
        checks.server = 'healthy';
        const allHealthy = Object.values(checks).every((status) => status === 'healthy');
        const response = {
            success: allHealthy,
            data: {
                status: allHealthy ? 'healthy' : 'degraded',
                checks,
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: {
                    used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                    total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
                },
            },
        };
        res.status(allHealthy ? 200 : 503).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.fullHealthCheck = fullHealthCheck;
//# sourceMappingURL=health.controller.js.map