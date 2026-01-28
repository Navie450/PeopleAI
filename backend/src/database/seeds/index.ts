import 'reflect-metadata';
import { AppDataSource } from '../../config/database';
import { Role } from '../../entities/Role';
import { logger } from '../../utils/logger';

const seedRoles = async () => {
  try {
    logger.info('Starting database seed...');

    await AppDataSource.initialize();
    logger.info('Database connection established');

    const roleRepository = AppDataSource.getRepository(Role);

    // Check if roles already exist
    const existingRoles = await roleRepository.count();
    if (existingRoles > 0) {
      logger.info('Roles already exist, skipping seed');
      return;
    }

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
    logger.info(`Successfully seeded ${roles.length} roles`);

    await AppDataSource.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedRoles();
