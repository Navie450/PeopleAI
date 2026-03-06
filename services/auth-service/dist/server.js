"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const environment_1 = require("./config/environment");
const logger_1 = require("./utils/logger");
const database_1 = require("./config/database");
const startServer = async () => {
    try {
        // Initialize database connection
        logger_1.logger.info('Initializing database connection...');
        await database_1.AppDataSource.initialize();
        logger_1.logger.info('Database connection established successfully');
        // Create Express app
        const app = (0, app_1.createApp)();
        // Start server
        const server = app.listen(environment_1.env.PORT, () => {
            logger_1.logger.info(`Server started successfully`, {
                port: environment_1.env.PORT,
                environment: environment_1.env.NODE_ENV,
                apiPrefix: environment_1.env.API_PREFIX,
            });
        });
        // Graceful shutdown
        const shutdown = async (signal) => {
            logger_1.logger.info(`${signal} received, shutting down gracefully...`);
            server.close(async () => {
                logger_1.logger.info('HTTP server closed');
                try {
                    await database_1.AppDataSource.destroy();
                    logger_1.logger.info('Database connection closed');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.logger.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });
            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger_1.logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map