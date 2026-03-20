import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BalanceAccountStatus, AccountType } from '@appTypes';
import { User, BalanceHold, TransactionReversal } from '@entities';

@Entity()
export class BalanceAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.balanceAccounts, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ nullable: true })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.frozenAccounts, { nullable: true })
  @JoinColumn({ name: 'frozen_by_id' })
  frozenBy: User | null;

  @Column({ nullable: true })
  frozenById: string | null;

  @OneToMany(() => BalanceHold, (hold) => hold.balanceAccount)
  balanceHolds: BalanceHold[];

  @OneToMany(() => TransactionReversal, (reversal) => reversal.balanceAccount)
  reversedTransactions: TransactionReversal[];

  @Column({ type: 'varchar', length: 50, unique: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  heldBalance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  pendingBalance: number;

  @Column({
    name: 'total_balance',
    type: 'decimal',
    precision: 15,
    scale: 2,
    asExpression: 'available_balance + held_balance + pending_balance',
    generatedType: 'STORED',
    insert: false,
    update: false,
  })
  totalBalance: number;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.MAIN,
  })
  type: AccountType;

  @Column({
    type: 'enum',
    enum: BalanceAccountStatus,
    default: BalanceAccountStatus.ACTIVE,
  })
  status: BalanceAccountStatus;

  @Column({ type: 'boolean', default: true })
  isPrimary: boolean;

  @Column({ type: 'text', nullable: true })
  frozenReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  frozenAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
