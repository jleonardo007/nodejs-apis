import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PaymentMethods, TransactionStatus } from '@appTypes';
import { User, TransactionEvent } from '@entities';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  idempotencyKey: string;

  @ManyToOne(() => User, (user) => user.sentTransactions, { nullable: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ nullable: true })
  senderId: string;

  @ManyToOne(() => User, (user) => user.receivedTransactions, { nullable: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column({ nullable: true })
  receiverId: string;

  @OneToMany(() => TransactionEvent, (event) => event.transaction)
  events: TransactionEvent[];

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentMethods,
  })
  paymentMethod: PaymentMethods;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalReference: string | null;

  @Column({ type: 'varchar', length: 50 })
  gatewayName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
