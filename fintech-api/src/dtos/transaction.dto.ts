import { z } from 'zod';
import { PaymentMethods } from '@appTypes';

export const CreateTransactionSchema = z.object({
  idempotencyKey: z.string().min(1).max(255),
  receiverId: z.uuid(),
  amount: z.number().positive(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  PaymentMethod: z.enum(PaymentMethods),
  description: z.string().max(255).optional(),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
