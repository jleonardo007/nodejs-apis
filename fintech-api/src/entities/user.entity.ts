import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { IdentificationType, AccountStatus, RiskLevel } from '@appTypes';
import { Role, Session, BalanceAccount, Transaction } from '@entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  lastName: string;

  @Column({
    type: 'enum',
    enum: IdentificationType,
  })
  identificationType: IdentificationType;

  @Column({
    type: 'date',
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 2,
  })
  countryCode: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  autoBlockEnabled: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  emailVerified: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  emailVerifiedAt?: Date | null;

  @Column({
    type: 'int',
    default: 0,
  })
  failedLoginAttemps: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastFailedLoginAt?: Date | null;

  @Column({
    type: 'inet',
    nullable: true,
  })
  lastLoginIp: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: 'active',
  })
  accountStatus: AccountStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  accountLockedUntil?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @OneToMany(() => Role, (role) => role.user)
  roles: Role[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  // Customer related fields
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    unique: true,
  })
  phone?: string | null;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  phoneVerified?: boolean | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  phoneVerifiedAt?: Date | null;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
  })
  riskLevel?: RiskLevel | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  riskScore?: number | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastTransactionAt?: Date | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  totalTransactionCount?: number | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  totalTransactionVolume?: number | null;

  @OneToMany(() => BalanceAccount, (account) => account.user)
  balanceAccounts: BalanceAccount[];

  @OneToMany(() => BalanceAccount, (account) => account.frozenBy)
  frozenAccounts: BalanceAccount[];

  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  receivedTransactions: Transaction[];
}
