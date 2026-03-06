"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const environment_1 = require("./environment");
const User_1 = require("../entities/User");
const Role_1 = require("../entities/Role");
const UserRole_1 = require("../entities/UserRole");
const AuditLog_1 = require("../entities/AuditLog");
const TokenCache_1 = require("../entities/TokenCache");
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
    entities: [User_1.User, Role_1.Role, UserRole_1.UserRole, AuditLog_1.AuditLog, TokenCache_1.TokenCache],
    migrations: ['src/database/migrations/**/*.ts'],
    subscribers: [],
    maxQueryExecutionTime: 1000,
});
//# sourceMappingURL=database.js.map