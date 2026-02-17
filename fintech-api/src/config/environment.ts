import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from './logger';

// Helper to parse comma-separated strings into arrays
const commaSeparated = z.string().transform((val) => val.split(',').map((s) => s.trim()));

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().default('/api'),
  API_VERSION: z.string().default('V1'),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/, 'Invalid format, e.g: 24h, 7d, 60s'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/, 'Invalid format, e.g: 24h, 7d, 60s'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  LOG_FILE_ERROR: z.string().default('logs/error.log'),
  LOG_FILE_COMBINED: z.string().default('logs/combined.log'),
  LOG_FILE_ACCESS: z.string().default('logs/access.log'),

  // CORS
  CORS_ORIGIN: commaSeparated,
  CORS_CREDENTIALS: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),

  // Encryption
  ENCRYPTION_KEY: z.string().length(32, 'ENCRYPTION_KEY must be exactly 32 characters'),
  ENCRYPTION_ALGORITHM: z.enum(['aes-256-cbc', 'aes-256-gcm']).default('aes-256-cbc'),

  // Pagination
  DEFAULT_PAGE_SIZE: z.coerce.number().int().positive().default(20),
  MAX_PAGE_SIZE: z.coerce.number().int().positive().default(100),

  // File Upload
  MAX_FILE_SIZE: z.coerce.number().int().positive().default(5242880),
  ALLOWED_FILE_TYPES: commaSeparated,

  // Feature Flags
  ENABLE_SWAGGER: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),
  ENABLE_RATE_LIMITING: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),
  ENABLE_CACHING: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),
  ENABLE_AUDIT_LOG: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  dotenv.config();
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    logger.error('\nInvalid environment variables:\n');
    logger.error(`\n${errors}\n`);
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
