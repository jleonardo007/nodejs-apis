import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TransactionEventType } from '@appTypes';
import { Transaction } from '@entities';

@Entity()
export class TransactionEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.events)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column({ nullable: true })
  transactionId: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: TransactionEventType;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ type: 'jsonb' })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
