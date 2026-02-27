import { Request, Response } from 'express';
import { userService } from '@services';
import { UpdateUserDto, UpdatePasswordDto } from '@dtos';

export async function getMe(_req: Request, res: Response) {
  const user = await userService.getMe(res.locals.userId!);

  res.status(200).json({
    message: 'User retrieved successfully',
    data: user,
  });
}

export async function updateUser(_req: Request, res: Response) {
  const dto = res.locals.body as UpdateUserDto;
  const user = await userService.updateUser(res.locals.userId!, dto);

  res.status(200).json({
    message: 'User updated successfully',
    data: user,
  });
}

export async function updatePassword(_req: Request, res: Response) {
  const dto = res.locals.body as UpdatePasswordDto;
  await userService.updatePassword(res.locals.userId!, dto);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({ message: 'Password updated successfully' });
}
