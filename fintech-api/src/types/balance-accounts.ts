export enum BalanceAccountStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

export enum AccountType {
  MAIN = 'main',
  SAVINGS = 'savings',
}

export enum BalanceHoldType {
  PAYMENT_PENDING = 'payment_pending',
  REVERSAL_HOLD = 'reversal_hold',
  FRAUD_REVIEW = 'fraud_review',
  WITHDRAWAL_PROCESSING = 'withdrawal_processing',
  CHARGE_BACK_DISPUTE = 'chargeback_dispute',
}

export enum BalanceHoldStatus {
  ACTIVE = 'active',
  RELEASED = 'released',
  EXPIRED = 'expired',
}
