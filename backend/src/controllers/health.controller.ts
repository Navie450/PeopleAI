import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { env } from '../config/environment';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

export const healthCheck = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    },
  };

  res.json(response);
};

export const databaseHealthCheck = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const startTime = Date.now();

    if (!AppDataSource.isInitialized) {
      throw new Error('Database connection not initialized');
    }

    // Simple query to check database connection
    await AppDataSource.query('SELECT 1');

    const responseTime = Date.now() - startTime;

    const response: ApiResponse = {
      success: true,
      data: {
        status: 'healthy',
        database: 'connected',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      },
    };

    res.json(response);
  } catch (error) {
    logger.error('Database health check failed:', error);
    next(error);
  }
};

export const fullHealthCheck = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checks = {
      database: 'unknown',
      server: 'unknown',
    };

    // Check database
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.query('SELECT 1');
        checks.database = 'healthy';
      } else {
        checks.database = 'not_initialized';
      }
    } catch (error) {
      checks.database = 'unhealthy';
      logger.error('Database check failed:', error);
    }

    // Check server
    checks.server = 'healthy';

    const allHealthy = Object.values(checks).every(
      (status) => status === 'healthy'
    );

    const response: ApiResponse = {
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
  } catch (error) {
    next(error);
  }
};
