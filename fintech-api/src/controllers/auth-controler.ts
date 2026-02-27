import { Request, Response } from 'express';
import { authService } from '@services';
import { CreateUserDto, SigninDto } from '@dtos';
import { getClientInfo, setAuthCookies, clearAuthCookies } from '@utils';

export async function createUserByRole(_req: Request, res: Response) {
  const dto = res.locals.validatedDto as CreateUserDto;
  const userId = res.locals.userId || null;
  const { savedUser } = await authService.createUserByRole(dto, userId);

  res.status(201).json({
    message: 'User created successfully',
    data: {
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
    },
  });
}

export async function customerSignup(req: Request, res: Response) {
  const { userAgent, ipAddress } = getClientInfo(req);
  const dto = res.locals.validatedDto as CreateUserDto;
  const { savedUser, accessToken, refreshToken } = await authService.customerSignup(
    dto,
    userAgent,
    ipAddress
  );

  setAuthCookies(res, accessToken, refreshToken);

  res.status(201).json({
    message: 'User created successfully',
    data: {
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
    },
  });
}

export async function signin(req: Request, res: Response) {
  const { userAgent, ipAddress } = getClientInfo(req);
  const dto = res.locals.validatedDto as SigninDto;
  const { user, accessToken, refreshToken } = await authService.signin(dto, userAgent, ipAddress);

  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({
    message: 'Signed in successfully',
    data: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}

export async function logout(req: Request, res: Response) {
  const refreshToken: string | undefined = req.cookies?.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  clearAuthCookies(res);

  res.status(200).json({ message: 'Logged out successfully' });
}
