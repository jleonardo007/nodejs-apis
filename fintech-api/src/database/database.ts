import 'reflect-metadata';
import path from 'path';
import { sync as globSync } from 'glob';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from '@utils';
import * as dotenv from 'dotenv';

dotenv.config();

const entityFiles = globSync(path.join(__dirname, '../entities/**/*.entity.ts'));
const migrationFiles = globSync(path.join(__dirname, '../database/migrations/**/*.ts')).sort(); // Sort migrations alphabetically to ensure correct execution order based on timestamp prefix

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: false,
  entities: entityFiles,
  migrations: migrationFiles,
});
