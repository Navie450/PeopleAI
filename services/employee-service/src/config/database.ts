import { DataSource } from 'typeorm';
import { env } from './environment';
import { Employee } from '../entities/Employee';
import { Department } from '../entities/Department';
import { LeaveRequest } from '../entities/LeaveRequest';
import { Announcement } from '../entities/Announcement';
import { AuditLog } from '../entities/AuditLog';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: env.NODE_ENV !== 'production',
  logging: env.DB_LOGGING,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  entities: [Employee, Department, LeaveRequest, Announcement, AuditLog],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: [],
  maxQueryExecutionTime: 1000,
});
