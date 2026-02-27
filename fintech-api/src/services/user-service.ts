import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UpdatePasswordDto } from '@dtos';
import { SessionRevokeReason } from '@appTypes';
import { NotFoundException, UnauthorizedException } from '@exceptions';
import { UserRepository, SessionRepository } from '@repositories';

class UserService {
  async getMe(userId: string) {
    const user = await UserRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        identificationType: true,
        dateOfBirth: true,
        countryCode: true,
        emailVerified: true,
        emailVerifiedAt: true,
        accountStatus: true,
        phone: true,
        phoneVerified: true,
        phoneVerifiedAt: true,
        riskLevel: true,
        riskScore: true,
        lastTransactionAt: true,
        totalTransactionCount: true,
        totalTransactionVolume: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    await UserRepository.update(userId, dto);

    return await UserRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        identificationType: true,
        dateOfBirth: true,
        countryCode: true,
        emailVerified: true,
        emailVerifiedAt: true,
        accountStatus: true,
        phone: true,
        phoneVerified: true,
        phoneVerifiedAt: true,
        riskLevel: true,
        riskScore: true,
        lastTransactionAt: true,
        totalTransactionCount: true,
        totalTransactionVolume: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await UserRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    await UserRepository.update(userId, { passwordHash: newPasswordHash });

    // Revoke all active sessions — force re-login
    await SessionRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true, revokedReason: SessionRevokeReason.LOGOUT }
    );
  }
}

export const userService = new UserService();
