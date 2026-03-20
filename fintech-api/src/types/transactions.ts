export enum PaymentMethods {
  WALLET = 'wallet',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVERSED = 'reversed',
}

export enum ReversalStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum ReversalType {
  CUSTOMER_REQUEST = 'customer_request',
  CHARGE_BACK = 'charge_back',
  FRAUD = 'fraud',
  ERROR = 'error',
}

export enum TransactionEventType {
  // ── Transaction lifecycle ────────────────────────────────────────────────
  /** Transaction created with status=pending */
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  /** Status changed. payload: { previous_status, new_status } */
  TRANSACTION_STATUS_CHANGED = 'TRANSACTION_STATUS_CHANGED',
  /** Attempt to external gateway. payload: { gateway_name, attempt_number, result } */
  TRANSACTION_GATEWAY_ATTEMPTED = 'TRANSACTION_GATEWAY_ATTEMPTED',
  /** status → completed; balances updated atomically */
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  /** status → failed after exhausting retries; hold reverted */
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  /** status → reversed; reversal executed */
  TRANSACTION_REVERSED = 'TRANSACTION_REVERSED',
  /** User requested retry; job enqueued in BullMQ */
  TRANSACTION_RETRY_ENQUEUED = 'TRANSACTION_RETRY_ENQUEUED',

  // ── Balances and holds ───────────────────────────────────────────────────
  /** Hold created on an account. payload: { hold_type, amount } */
  BALANCE_HOLD_CREATED = 'BALANCE_HOLD_CREATED',
  /** Hold released manually or by completing/reversing the transaction */
  BALANCE_HOLD_RELEASED = 'BALANCE_HOLD_RELEASED',
  /** Hold released by BullMQ job when expires_at is reached */
  BALANCE_HOLD_EXPIRED = 'BALANCE_HOLD_EXPIRED',
  /** available_balance decreased. payload: { account_id, amount, reason } */
  BALANCE_DEBITED = 'BALANCE_DEBITED',
  /** available_balance increased. payload: { account_id, amount, reason } */
  BALANCE_CREDITED = 'BALANCE_CREDITED',

  // ── Reversals ────────────────────────────────────────────────────────────
  /** transaction_reversal created with status=requested */
  REVERSAL_REQUESTED = 'REVERSAL_REQUESTED',
  /** Admin approves the reversal */
  REVERSAL_APPROVED = 'REVERSAL_APPROVED',
  /** Admin rejects the reversal */
  REVERSAL_REJECTED = 'REVERSAL_REJECTED',
  /** Reversal executed; balances reverted atomically */
  REVERSAL_COMPLETED = 'REVERSAL_COMPLETED',

  // ── Fraud ────────────────────────────────────────────────────────────────
  /** fraud_flag created for an active signal. payload: { signal_code, weight } */
  FRAUD_FLAG_CREATED = 'FRAUD_FLAG_CREATED',
  /** fraud_flag marked as resolved by compliance */
  FRAUD_FLAG_RESOLVED = 'FRAUD_FLAG_RESOLVED',
  /** Account automatically blocked due to HIGH score */
  ACCOUNT_AUTO_BLOCKED = 'ACCOUNT_AUTO_BLOCKED',

  // ── Limits ───────────────────────────────────────────────────────────────
  /** Transaction rejected due to limit. payload: { limit_type, limit_value, attempted_value } */
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  /** user_limit_override applied instead of global limit */
  LIMIT_OVERRIDE_APPLIED = 'LIMIT_OVERRIDE_APPLIED',

  // ── Reconciliation ───────────────────────────────────────────────────────
  /** BullMQ job starts CSV comparison */
  RECONCILIATION_STARTED = 'RECONCILIATION_STARTED',
  /** All records processed; counters updated */
  RECONCILIATION_COMPLETED = 'RECONCILIATION_COMPLETED',
  /** Processing error; job moved to DLQ */
  RECONCILIATION_FAILED = 'RECONCILIATION_FAILED',

  // ── Account ──────────────────────────────────────────────────────────────
  /** account_status changed. payload: { previous_status, new_status, reason } */
  ACCOUNT_STATUS_CHANGED = 'ACCOUNT_STATUS_CHANGED',
}
