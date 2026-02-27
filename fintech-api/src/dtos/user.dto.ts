import { z } from 'zod';

export const GetMeSchema = z.object({
  userId: z.uuid(),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
