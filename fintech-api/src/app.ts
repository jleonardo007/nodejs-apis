import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from '@routes/index';
import { errorHandler } from '@middlewares/index';
import { logger } from '@config/logger';
import { env } from '@config/environment';

const app = express();

// Global middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use(env.API_PREFIX, routes);

// Error handler
app.use(errorHandler);

export default app;
