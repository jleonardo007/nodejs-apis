import { Request, Response, NextFunction, Router } from 'express';
import { UserRoles } from '@appTypes';
import { BadRequestException } from '@exceptions';
import { validateDTO, authenticate, authorize } from '@middlewares';
import { UserRepository } from '@repositories';

import {
  CreateUserSchema,
  SigninSchema,
  GetMeSchema,
  UpdateUserSchema,
  UpdatePasswordSchema,
  CreateUserDto,
} from '@dtos';

import {
  customerSignup,
  createUserByRole,
  signin,
  logout,
  getMe,
  updateUser,
  updatePassword,
} from '@controllers';

const router = Router();

// Authentication and authorization endpoints
router.get('/signin', validateDTO(SigninSchema), signin);
router.post('/customer-signup', validateDTO(CreateUserSchema), customerSignup);
router.post('/logout', authenticate, logout);
router.patch('/update-user', validateDTO(UpdateUserSchema), authenticate, updateUser);
router.put('/update-password', validateDTO(UpdatePasswordSchema), authenticate, updatePassword);
router.get('/get-me', validateDTO(GetMeSchema), authenticate, authorize(UserRoles.CUSTOMER), getMe);
router.post(
  '/create-user-by-role',
  validateDTO(CreateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const hasAdmins = await UserRepository.hasAdmins();
    const { roles } = res.locals.validatedDto as CreateUserDto;

    if (!hasAdmins) {
      if (!roles.includes(UserRoles.ADMIN)) {
        return next(new BadRequestException('An admin must be created first before another role'));
      }
      return next();
    }

    authenticate(req, res, (error?: unknown) => {
      if (error) return next(error);
      authorize(UserRoles.ADMIN)(req, res, next);
    });
  },
  createUserByRole
);

export default router;
