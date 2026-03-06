"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("../../config/database");
const Role_1 = require("../../entities/Role");
const User_1 = require("../../entities/User");
const UserRole_1 = require("../../entities/UserRole");
const logger_1 = require("../../utils/logger");
const bcrypt_1 = __importDefault(require("bcrypt"));
const seed = async () => {
    try {
        logger_1.logger.info('Starting auth-service seed...');
        await database_1.AppDataSource.initialize();
        logger_1.logger.info('Database connection established');
        const roleRepository = database_1.AppDataSource.getRepository(Role_1.Role);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const userRoleRepository = database_1.AppDataSource.getRepository(UserRole_1.UserRole);
        // ── Seed Roles ──────────────────────────────────────────────
        const existingRoles = await roleRepository.count();
        if (existingRoles > 0) {
            logger_1.logger.info('Roles already exist, skipping role seed');
        }
        else {
            const roles = [
                {
                    name: 'admin',
                    description: 'Administrator with full access to all features',
                    permissions: {
                        users: ['create', 'read', 'update', 'delete'],
                        roles: ['assign', 'revoke'],
                        settings: ['read', 'update'],
                    },
                },
                {
                    name: 'manager',
                    description: 'Manager with limited administrative access',
                    permissions: {
                        users: ['read', 'update'],
                        roles: ['read'],
                        settings: ['read'],
                    },
                },
                {
                    name: 'user',
                    description: 'Standard user with basic access',
                    permissions: {
                        profile: ['read', 'update'],
                    },
                },
            ];
            await roleRepository.save(roles);
            logger_1.logger.info(`Seeded ${roles.length} roles`);
        }
        // ── Seed Users ──────────────────────────────────────────────
        const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
        const managerRole = await roleRepository.findOne({ where: { name: 'manager' } });
        const userRole = await roleRepository.findOne({ where: { name: 'user' } });
        if (!adminRole || !managerRole || !userRole) {
            throw new Error('Roles not found after seeding');
        }
        const defaultPassword = await bcrypt_1.default.hash('Password123!', 10);
        const usersToSeed = [
            { email: 'admin@peopleai.com', first_name: 'Admin', last_name: 'User', role: adminRole },
            { email: 'manager1@peopleai.com', first_name: 'Sarah', last_name: 'Johnson', role: managerRole },
            { email: 'manager2@peopleai.com', first_name: 'Michael', last_name: 'Chen', role: managerRole },
            { email: 'john.doe@peopleai.com', first_name: 'John', last_name: 'Doe', role: userRole },
            { email: 'emily.smith@peopleai.com', first_name: 'Emily', last_name: 'Smith', role: userRole },
            { email: 'david.wilson@peopleai.com', first_name: 'David', last_name: 'Wilson', role: userRole },
            { email: 'jessica.brown@peopleai.com', first_name: 'Jessica', last_name: 'Brown', role: userRole },
            { email: 'robert.taylor@peopleai.com', first_name: 'Robert', last_name: 'Taylor', role: userRole },
            { email: 'amanda.martinez@peopleai.com', first_name: 'Amanda', last_name: 'Martinez', role: userRole },
            { email: 'chris.anderson@peopleai.com', first_name: 'Chris', last_name: 'Anderson', role: userRole },
        ];
        for (const u of usersToSeed) {
            const exists = await userRepository.findOne({ where: { email: u.email } });
            if (exists) {
                logger_1.logger.info(`User ${u.email} already exists, skipping`);
                continue;
            }
            const user = userRepository.create({
                email: u.email,
                password_hash: defaultPassword,
                first_name: u.first_name,
                last_name: u.last_name,
                display_name: `${u.first_name} ${u.last_name}`,
                is_active: true,
                email_verified: true,
            });
            await userRepository.save(user);
            const userRoleEntry = userRoleRepository.create({
                user_id: user.id,
                role_id: u.role.id,
            });
            await userRoleRepository.save(userRoleEntry);
            logger_1.logger.info(`Created ${u.role.name}: ${u.email}`);
        }
        // ── Summary ─────────────────────────────────────────────────
        const totalUsers = await userRepository.count();
        const adminCount = await userRoleRepository.count({ where: { role_id: adminRole.id } });
        const managerCount = await userRoleRepository.count({ where: { role_id: managerRole.id } });
        const userCount = await userRoleRepository.count({ where: { role_id: userRole.id } });
        logger_1.logger.info('=== Auth Seed Complete ===');
        logger_1.logger.info(`Total Users: ${totalUsers} (Admins: ${adminCount}, Managers: ${managerCount}, Users: ${userCount})`);
        logger_1.logger.info('Default password for all users: Password123!');
        await database_1.AppDataSource.destroy();
        logger_1.logger.info('Database connection closed');
    }
    catch (error) {
        logger_1.logger.error('Error seeding auth database:', error);
        process.exit(1);
    }
};
seed();
//# sourceMappingURL=index.js.map