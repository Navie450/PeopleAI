"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const environment_1 = require("./environment");
const Employee_1 = require("../entities/Employee");
const Department_1 = require("../entities/Department");
const LeaveRequest_1 = require("../entities/LeaveRequest");
const Announcement_1 = require("../entities/Announcement");
const AuditLog_1 = require("../entities/AuditLog");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: environment_1.env.DB_HOST,
    port: environment_1.env.DB_PORT,
    username: environment_1.env.DB_USER,
    password: environment_1.env.DB_PASSWORD,
    database: environment_1.env.DB_NAME,
    synchronize: environment_1.env.NODE_ENV !== 'production',
    logging: environment_1.env.DB_LOGGING,
    ssl: environment_1.env.DB_SSL ? { rejectUnauthorized: false } : false,
    entities: [Employee_1.Employee, Department_1.Department, LeaveRequest_1.LeaveRequest, Announcement_1.Announcement, AuditLog_1.AuditLog],
    migrations: ['src/database/migrations/**/*.ts'],
    subscribers: [],
    maxQueryExecutionTime: 1000,
});
//# sourceMappingURL=database.js.map