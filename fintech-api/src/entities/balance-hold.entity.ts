import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm';

import { BalanceHoldType, BalanceHoldStatus } from '@appTypes';
import { BalanceAccount, Transaction } from '@entities';

@Entity()
export class BalanceHold {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BalanceAccount, (balanceAccount) => balanceAccount.balanceHolds)
  @JoinColumn({ name: 'balance_account_id' })
  balanceAccount: BalanceAccount;

  @Column()
  balanceAccountId: string;

  @OneToOne(() => Transaction)
  @JoinColumn()
  balanceHold: Transaction;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: BalanceHoldStatus,
    default: BalanceHoldStatus.ACTIVE,
  })
  status: BalanceHoldStatus;

  @Column({
    type: 'enum',
    enum: BalanceHoldType,
  })
  type: BalanceHoldType;

  @Column({ type: 'text', nullable: true })
  holdReason: string | null;

  @Column({ type: 'timestamp' })
  expiresAt: string;

  @Column({ type: 'timestamp' })
  releasedAt: string;
}
