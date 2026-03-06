import 'reflect-metadata';
import { AppDataSource } from '../../config/database';
import { Role } from '../../entities/Role';
import { User } from '../../entities/User';
import { UserRole } from '../../entities/UserRole';
import { logger } from '../../utils/logger';
import bcrypt from 'bcrypt';

const seed = async () => {
  try {
    logger.info('Starting auth-service seed...');

    await AppDataSource.initialize();
    logger.info('Database connection established');

    const roleRepository = AppDataSource.getRepository(Role);
    const userRepository = AppDataSource.getRepository(User);
    const userRoleRepository = AppDataSource.getRepository(UserRole);

    // ── Seed Roles ──────────────────────────────────────────────
    const existingRoles = await roleRepository.count();
    if (existingRoles > 0) {
      logger.info('Roles already exist, skipping role seed');
    } else {
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
      logger.info(`Seeded ${roles.length} roles`);
    }

    // ── Seed Users ──────────────────────────────────────────────
    const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    const managerRole = await roleRepository.findOne({ where: { name: 'manager' } });
    const userRole = await roleRepository.findOne({ where: { name: 'user' } });

    if (!adminRole || !managerRole || !userRole) {
      throw new Error('Roles not found after seeding');
    }

    const defaultPassword = await bcrypt.hash('Password123!', 10);

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
        logger.info(`User ${u.email} already exists, skipping`);
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

      logger.info(`Created ${u.role.name}: ${u.email}`);
    }

    // ── Summary ─────────────────────────────────────────────────
    const totalUsers = await userRepository.count();
    const adminCount = await userRoleRepository.count({ where: { role_id: adminRole.id } });
    const managerCount = await userRoleRepository.count({ where: { role_id: managerRole.id } });
    const userCount = await userRoleRepository.count({ where: { role_id: userRole.id } });

    logger.info('=== Auth Seed Complete ===');
    logger.info(`Total Users: ${totalUsers} (Admins: ${adminCount}, Managers: ${managerCount}, Users: ${userCount})`);
    logger.info('Default password for all users: Password123!');

    await AppDataSource.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error seeding auth database:', error);
    process.exit(1);
  }
};

seed();
