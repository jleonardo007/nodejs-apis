import { addDays } from 'date-fns';
import { AppDataSource } from '@config/database';
import { User, Role } from '@entities';
import { UserRoles } from '@appTypes';

const NON_EXPIRING_ROLE_DAYS = 180;

export const RoleRepository = AppDataSource.getRepository(Role).extend({
  async assignCustomerRole(user: User) {
    const newRole = this.create({
      user,
      role: UserRoles.CUSTOMER,
      grantedAt: new Date(),
    });
    return await this.save(newRole);
  },

  async assignRole(user: User, grantedBy: string | null, role: UserRoles) {
    const newRole = this.create({
      user,
      role,
      grantedBy: { id: grantedBy } as User,
      grantedAt: new Date(),
      isActive: true,
      expiresAt: addDays(new Date(), NON_EXPIRING_ROLE_DAYS),
    });
    return await this.save(newRole);
  },
});
