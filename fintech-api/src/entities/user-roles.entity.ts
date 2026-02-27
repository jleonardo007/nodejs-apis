import { PrimaryGeneratedColumn, Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserRoles } from '@appTypes';
import { User } from '@entities';

@Entity({ name: 'user_roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.roles, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'granted_by_user_id' })
  grantedBy: User | null;

  @Column({
    type: 'enum',
    enum: UserRoles,
  })
  role: UserRoles;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  grantedAt: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expiresAt: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  revokedAt: Date | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
