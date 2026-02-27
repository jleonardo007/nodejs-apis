import { AppDataSource } from '@config/database';
import { UserRoles } from '@appTypes';
import { User } from '@entities/user.entity';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  },

  async existsByEmail(email: string) {
    const count = await this.countBy({ email });
    return count > 0;
  },

  async hasAdmins() {
    const count = await this.createQueryBuilder('user')
      .innerJoin('user.roles', 'role')
      .where('role.role = :role', { role: UserRoles.ADMIN })
      .andWhere('role.isActive = true')
      .andWhere('(role.expiresAt IS NULL OR role.expiresAt > NOW())')
      .getCount();

    return count > 0;
  },
});
