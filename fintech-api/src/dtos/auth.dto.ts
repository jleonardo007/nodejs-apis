import { z } from 'zod';
import { IdentificationType, UserRoles } from '@appTypes';

export const CreateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
  phone: z.string().min(7).max(20),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.coerce.date(),
  countryCode: z.string().length(2),
  identificationType: z.enum(IdentificationType),
  roles: z.array(z.enum(UserRoles)),
});

export const SigninSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type SigninDto = z.infer<typeof SigninSchema>;
