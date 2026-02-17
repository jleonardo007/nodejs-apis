import { DataSource } from 'typeorm';
import { env } from './environment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: env.NODE_ENV === 'development',
  entities: [
    env.NODE_ENV === 'production' ? 'dist/entities/**/*.entity.js' : 'src/entities/**/*.entity.ts',
  ],
  migrations: [
    env.NODE_ENV === 'production'
      ? 'dist/database/migrations/**/*.js'
      : 'src/database/migrations/**/*.ts',
  ],
});
