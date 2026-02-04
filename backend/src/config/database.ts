import { DataSource } from 'typeorm';
import { env } from './environment';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { UserRole } from '../entities/UserRole';
import { AuditLog } from '../entities/AuditLog';
import { TokenCache } from '../entities/TokenCache';
import { Employee } from '../entities/Employee';
import { Department } from '../entities/Department';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false, // Never use true in production
  logging: env.DB_LOGGING,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  entities: [User, Role, UserRole, AuditLog, TokenCache, Employee, Department],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: [],
  maxQueryExecutionTime: 1000, // Log slow queries (>1s)
});
