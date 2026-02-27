export enum IdentificationType {
  DNI = 'dni',
  PASSPORT = 'passport',
  TAX_ID = 'taxId',
}

export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked',
  CLOSED = 'closed',
  FROZEN = 'frozen',
}

export enum RiskLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum UserRoles {
  ADMIN = 'admin',
  COMPLIANCE_OFFICER = 'compliance_officer',
  FINANCE_MANAGER = 'finance_manager',
  AUDITOR = 'auditor',
  SUPPORT = 'support',
  CUSTOMER = 'customer',
}

export enum SessionRevokeReason {
  LOGOUT = 'logout',
  SECURITY = 'security',
  TIMEOUT = 'timeout',
  SUSPICIOUS = 'suspicious',
  EXPIRED = 'expired',
  INVALID = 'invalid_token',
}
