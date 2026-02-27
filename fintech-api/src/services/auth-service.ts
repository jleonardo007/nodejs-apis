import bcrypt from 'bcrypt';
import { isAfter, format } from 'date-fns';
import { env } from '@config/environment';
import { UserRoles, SessionRevokeReason } from '@appTypes';
import { CreateUserDto, SigninDto } from '@dtos';
import { ConflictException, NotFoundException, UnauthorizedException } from '@exceptions';
import { UserRepository, RoleRepository, SessionRepository } from '@repositories';
import { hashToken } from '@utils';

class AuthService {
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, env.SALT_ROUNDS);
  }

  private async comparePassword(password: string, encryptedPassword: string) {
    return await bcrypt.compare(password, encryptedPassword);
  }

  async createUserByRole(dto: CreateUserDto, grantedBy: string | null) {
    const { email, roles, password, ...rest } = dto;
    const passwordHash = await this.hashPassword(password);
    const emailExists = await UserRepository.existsByEmail(email);

    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    const newUser = UserRepository.create({ email, passwordHash, ...rest });
    const savedUser = await UserRepository.save(newUser);

    for (const role of roles) {
      await RoleRepository.assignRole(savedUser, grantedBy, role);
    }

    return { savedUser };
  }

  async customerSignup(dto: CreateUserDto, userAgent: string, ipAddress: string) {
    const { email, password, roles: _roles, ...rest } = dto;
    const emailExists = await UserRepository.existsByEmail(email);
    const passwordHash = await this.hashPassword(password);

    if (emailExists) {
      throw new ConflictException('Email already in use');
    }
    const newUser = UserRepository.create({
      email,
      passwordHash,
      lastLoginIp: ipAddress,
      ...rest,
    });

    const savedUser = await UserRepository.save(newUser);
    await RoleRepository.assignCustomerRole(savedUser);
    const { accessToken, refreshToken } = await SessionRepository.createSession({
      user: savedUser,
      roles: [UserRoles.CUSTOMER],
      userAgent,
      ipAddress,
    });

    return { savedUser, accessToken, refreshToken };
  }

  async signin(dto: SigninDto, userAgent: string, ipAddress: string) {
    const { email, password } = dto;
    const user = await UserRepository.findOne({ where: { email }, relations: { roles: true } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      await UserRepository.update(user.id, {
        failedLoginAttemps: user.failedLoginAttemps + 1,
        lastFailedLoginAt: new Date(),
      });

      throw new UnauthorizedException('Invalid password');
    }

    if (user.accountLockedUntil && isAfter(user.accountLockedUntil, new Date())) {
      throw new UnauthorizedException(
        `Account is locked, try again later at ${format(user.accountLockedUntil, 'MM/dd/yyyy')}`
      );
    }

    const { accessToken, refreshToken } = await SessionRepository.createSession({
      user,
      userAgent,
      ipAddress,
      roles: user.roles
        .filter((r) => r.isActive && (!r.expiresAt || r.expiresAt > new Date()))
        .map((r) => r.role),
    });

    return { user, accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);

    const session = await SessionRepository.findOne({
      where: { refreshTokenHash: tokenHash },
    });

    if (!session || session.isRevoked) {
      return;
    }

    await SessionRepository.revokeSession(session.id, SessionRevokeReason.LOGOUT);
  }
}

export const authService = new AuthService();
