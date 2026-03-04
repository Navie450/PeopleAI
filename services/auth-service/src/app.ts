import 'reflect-metadata';
import express, { Application } from 'express';
import { env } from './config/environment';
import { logger } from './utils/logger';
import {
  helmetConfig,
  corsConfig,
  rateLimiter,
  sanitize,
} from './middleware/security.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { randomUUID } from 'crypto';
import routes from './routes';

export const createApp = (): Application => {
  const app = express();

  // Request ID middleware
  app.use((req, _res, next) => {
    req.requestId = randomUUID();
    next();
  });

  // Security middleware
  app.use(helmetConfig);
  app.use(corsConfig);
  app.use(rateLimiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Sanitization middleware
  app.use(sanitize);

  // Request logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      requestId: req.requestId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // API routes
  app.use(env.API_PREFIX, routes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
