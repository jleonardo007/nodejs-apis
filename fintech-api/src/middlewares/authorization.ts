import { Request, Response, NextFunction } from 'express';
import { UserRoles } from '@appTypes';
import { ForbiddenException } from '@exceptions';

export const authorize = (...allowed: UserRoles[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const roles = res.locals.roles as UserRoles[];

    if (!roles.length) {
      return next(new ForbiddenException("Forbidden, user hasn't privileges"));
    }

    const hasRole = roles?.some((role) => allowed.includes(role));

    if (!hasRole) {
      return next(new ForbiddenException("Forbidden, user hasn't enough privileges"));
    }

    return next();
  };
};
