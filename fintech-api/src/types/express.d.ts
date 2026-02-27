import { UserRoles } from '../types';

declare global {
  namespace Express {
    interface Locals {
      userId?: string;
      roles?: UserRoles[];
      noAdmins: boolean;
      validatedDto: Record<string, unknown>;
    }
  }
}
