import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ValidationException, ValidationError } from '../exceptions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: PropertyKey[]): unknown {
  return path.reduce((current, key) => {
    return current?.[key];
  }, obj);
}

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      res.locals.body = validated.body || req.body;
      res.locals.query = validated.query || req.query;
      res.locals.params = validated.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: ValidationError[] = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.path.length > 0 ? getNestedValue(req, err.path) : undefined,
        }));

        next(new ValidationException('DTO validation error', formattedErrors));
      } else {
        next(error);
      }
    }
  };
};
