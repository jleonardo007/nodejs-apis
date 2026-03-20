import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ReversalStatus, ReversalType } from '@appTypes';
import { Transaction, BalanceAccount, User } from '@entities';

@Entity()
export class TransactionReversal {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => Transaction)
  originalTransaction: Transaction;

  @OneToOne(() => Transaction)
  reversalTransaction: Transaction;

  @OneToOne(() => User)
  requestedBy: User;

  @OneToOne(() => User)
  approvedBy: User;

  @ManyToOne(() => BalanceAccount, (balanceAccount) => balanceAccount.balanceHolds)
  @JoinColumn({ name: 'balance_account_id' })
  balanceAccount: BalanceAccount;

  @Column()
  balanceAccountId: string;

  @Column({ type: 'text' })
  reversalReason: string;

  @Column({
    type: 'enum',
    enum: ReversalStatus,
  })
  status: ReversalStatus;

  @Column({
    type: 'enum',
    enum: ReversalType,
  })
  type: ReversalType;

  @Column({ type: 'timestamp' })
  requestedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
