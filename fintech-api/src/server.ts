import 'reflect-metadata';
import app from './app';
import { AppDataSource } from '@config/database';
import { env } from '@config/environment';
import { logger } from '@config/logger';

const startServer = async () => {
  try {
    // Init Database
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    // Init Server
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
