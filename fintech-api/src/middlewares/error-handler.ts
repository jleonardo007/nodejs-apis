import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { BaseException } from '../exceptions';

export const errorHandler = (error: Error | BaseException, req: Request, res: Response) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (error instanceof BaseException) {
    return res.status(error.httpCode).json(error.toJSON());
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'UNHANDLED_SERVER_ERROR',
      message: error.message,
    },
  });
};
