import path from 'path';
import { sync as globSync } from 'glob';
import { DataSource } from 'typeorm';
import { env } from './environment';
import { SnakeNamingStrategy } from '@utils';

const entityFiles = globSync(path.join(__dirname, '../entities/**/*.entity.ts'));
const migrationFiles = globSync(path.join(__dirname, '../database/migrations/**/*.ts')).sort(); // Sort migrations alphabetically to ensure correct execution order based on timestamp prefix

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  entities:
    env.NODE_ENV === 'production'
      ? [path.join(__dirname, '../entities/**/*.entity.js')]
      : entityFiles,
  migrations:
    env.NODE_ENV === 'production'
      ? [path.join(__dirname, '../database/migrations/**/*.js')]
      : migrationFiles,
});
