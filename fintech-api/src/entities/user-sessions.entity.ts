import {
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '@entities';
import { SessionRevokeReason } from '@appTypes';

@Entity({ name: 'user_sessions' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  refreshTokenHash: string;

  @Column({ type: 'inet', nullable: true })
  ipAddress?: string | null;

  @Column({ type: 'text' })
  userAgent: string;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @Column({
    type: 'enum',
    enum: SessionRevokeReason,
    nullable: true,
  })
  revokedReason?: SessionRevokeReason | null;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
