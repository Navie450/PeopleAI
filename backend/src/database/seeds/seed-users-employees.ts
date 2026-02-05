import 'reflect-metadata';
import { AppDataSource } from '../../config/database';
import { User } from '../../entities/User';
import { Role } from '../../entities/Role';
import { UserRole } from '../../entities/UserRole';
import { Employee, EmploymentType, EmploymentStatus } from '../../entities/Employee';
import { Department } from '../../entities/Department';
import { logger } from '../../utils/logger';
import bcrypt from 'bcrypt';

interface SeedUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'user';
}

interface SeedEmployee {
  employee_id: string;
  first_name: string;
  last_name: string;
  work_email: string;
  job_title: string;
  job_level?: string;
  department_code: string;
  employment_type: EmploymentType;
  employment_status: EmploymentStatus;
  hire_date: string;
  work_location?: string;
  is_remote: boolean;
}

const seedData = async () => {
  try {
    logger.info('Starting user and employee seed...');

    await AppDataSource.initialize();
    logger.info('Database connection established');

    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);
    const userRoleRepository = AppDataSource.getRepository(UserRole);
    const employeeRepository = AppDataSource.getRepository(Employee);
    const departmentRepository = AppDataSource.getRepository(Department);

    // Get role IDs
    const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    const managerRole = await roleRepository.findOne({ where: { name: 'manager' } });
    const userRole = await roleRepository.findOne({ where: { name: 'user' } });

    if (!adminRole || !managerRole || !userRole) {
      throw new Error('Roles not found. Please run the roles seed first.');
    }

    // Get departments
    const departments = await departmentRepository.find();
    const deptMap = new Map(departments.map(d => [d.code, d]));

    // Hash password for all users
    const defaultPassword = await bcrypt.hash('Password123!', 10);

    // Manager users to create
    const managers: SeedUser[] = [
      {
        email: 'manager1@peopleai.com',
        password: defaultPassword,
        first_name: 'Sarah',
        last_name: 'Johnson',
        role: 'manager',
      },
      {
        email: 'manager2@peopleai.com',
        password: defaultPassword,
        first_name: 'Michael',
        last_name: 'Chen',
        role: 'manager',
      },
    ];

    // Regular users to create (7 more to make total 10)
    const regularUsers: SeedUser[] = [
      {
        email: 'john.doe@peopleai.com',
        password: defaultPassword,
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
      },
      {
        email: 'emily.smith@peopleai.com',
        password: defaultPassword,
        first_name: 'Emily',
        last_name: 'Smith',
        role: 'user',
      },
      {
        email: 'david.wilson@peopleai.com',
        password: defaultPassword,
        first_name: 'David',
        last_name: 'Wilson',
        role: 'user',
      },
      {
        email: 'jessica.brown@peopleai.com',
        password: defaultPassword,
        first_name: 'Jessica',
        last_name: 'Brown',
        role: 'user',
      },
      {
        email: 'robert.taylor@peopleai.com',
        password: defaultPassword,
        first_name: 'Robert',
        last_name: 'Taylor',
        role: 'user',
      },
      {
        email: 'amanda.martinez@peopleai.com',
        password: defaultPassword,
        first_name: 'Amanda',
        last_name: 'Martinez',
        role: 'user',
      },
      {
        email: 'chris.anderson@peopleai.com',
        password: defaultPassword,
        first_name: 'Chris',
        last_name: 'Anderson',
        role: 'user',
      },
    ];

    // Employee data for managers
    const managerEmployees: SeedEmployee[] = [
      {
        employee_id: 'EMP002',
        first_name: 'Sarah',
        last_name: 'Johnson',
        work_email: 'manager1@peopleai.com',
        job_title: 'Engineering Manager',
        job_level: 'Senior',
        department_code: 'ENG',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.ACTIVE,
        hire_date: '2022-03-15',
        work_location: 'San Francisco, CA',
        is_remote: false,
      },
      {
        employee_id: 'EMP003',
        first_name: 'Michael',
        last_name: 'Chen',
        work_email: 'manager2@peopleai.com',
        job_title: 'Product Manager',
        job_level: 'Senior',
        department_code: 'PRD',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.ACTIVE,
        hire_date: '2022-06-01',
        work_location: 'New York, NY',
        is_remote: false,
      },
    ];

    // Employee data for regular users
    const regularEmployees: SeedEmployee[] = [
      {
        employee_id: 'EMP004',
        first_name: 'John',
        last_name: 'Doe',
        work_email: 'john.doe@peopleai.com',
        job_title: 'Senior Software Engineer',
        job_level: 'Senior',
        department_code: 'ENG',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.ACTIVE,
        hire_date: '2023-01-10',
        work_location: 'San Francisco, CA',
        is_remote: false,
      },
      {
        employee_id: 'EMP005',
        first_name: 'Emily',
        last_name: 'Smith',
        work_email: 'emily.smith@peopleai.com',
        job_title: 'UX Designer',
        job_level: 'Mid',
        department_code: 'PRD',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.ACTIVE,
        hire_date: '2023-02-20',
        work_location: 'Austin, TX',
        is_remote: true,
      },
      {
        employee_id: 'EMP006',
        first_name: 'David',
        last_name: 'Wilson',
        work_email: 'david.wilson@peopleai.com',
        job_title: 'DevOps Engineer',
        job_level: 'Mid',
        department_code: 'ENG',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.ACTIVE,
        hire_date: '2023-03-05',
        work_location: 'Seattle, WA',
        is_remote: true,
      },
      {
        employee_id: 'EMP007',
        first_name: 'Jessica',
        last_name: 'Brown',
        work_email: 'jessica.brown@peopleai.com',
        job_title: 'HR Specialist',
        job_level: 'Junior',
        department_code: 'HR',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.ACTIVE,
        hire_date: '2023-04-15',
        work_location: 'San Francisco, CA',
        is_remote: false,
      },
      {
        employee_id: 'EMP008',
        first_name: 'Robert',
        last_name: 'Taylor',
        work_email: 'robert.taylor@peopleai.com',
        job_title: 'Financial Analyst',
        job_level: 'Mid',
        department_code: 'FIN',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.ACTIVE,
        hire_date: '2023-05-01',
        work_location: 'New York, NY',
        is_remote: false,
      },
      {
        employee_id: 'EMP009',
        first_name: 'Amanda',
        last_name: 'Martinez',
        work_email: 'amanda.martinez@peopleai.com',
        job_title: 'Marketing Specialist',
        job_level: 'Junior',
        department_code: 'MKT',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.PROBATION,
        hire_date: '2024-01-08',
        work_location: 'Los Angeles, CA',
        is_remote: true,
      },
      {
        employee_id: 'EMP010',
        first_name: 'Chris',
        last_name: 'Anderson',
        work_email: 'chris.anderson@peopleai.com',
        job_title: 'Sales Representative',
        job_level: 'Junior',
        department_code: 'SLS',
        employment_type: EmploymentType.FULL_TIME,
        employment_status: EmploymentStatus.ACTIVE,
        hire_date: '2023-11-20',
        work_location: 'Chicago, IL',
        is_remote: false,
      },
    ];

    // Create manager users
    logger.info('Creating manager users...');
    for (const managerData of managers) {
      const existingUser = await userRepository.findOne({ where: { email: managerData.email } });
      if (existingUser) {
        logger.info(`Manager ${managerData.email} already exists, skipping...`);
        continue;
      }

      const user = userRepository.create({
        email: managerData.email,
        password_hash: managerData.password,
        first_name: managerData.first_name,
        last_name: managerData.last_name,
        display_name: `${managerData.first_name} ${managerData.last_name}`,
        is_active: true,
        email_verified: true,
      });
      await userRepository.save(user);

      // Assign manager role
      const userRoleEntry = userRoleRepository.create({
        user_id: user.id,
        role_id: managerRole.id,
      });
      await userRoleRepository.save(userRoleEntry);

      logger.info(`Created manager: ${managerData.email}`);
    }

    // Create regular users
    logger.info('Creating regular users...');
    for (const userData of regularUsers) {
      const existingUser = await userRepository.findOne({ where: { email: userData.email } });
      if (existingUser) {
        logger.info(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      const user = userRepository.create({
        email: userData.email,
        password_hash: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        display_name: `${userData.first_name} ${userData.last_name}`,
        is_active: true,
        email_verified: true,
      });
      await userRepository.save(user);

      // Assign user role
      const userRoleEntry = userRoleRepository.create({
        user_id: user.id,
        role_id: userRole.id,
      });
      await userRoleRepository.save(userRoleEntry);

      logger.info(`Created user: ${userData.email}`);
    }

    // Create employee records for managers
    logger.info('Creating manager employee records...');
    for (const empData of managerEmployees) {
      const existingEmp = await employeeRepository.findOne({ where: { employee_id: empData.employee_id } });
      if (existingEmp) {
        logger.info(`Employee ${empData.employee_id} already exists, skipping...`);
        continue;
      }

      const user = await userRepository.findOne({ where: { email: empData.work_email } });
      const department = deptMap.get(empData.department_code);

      const employee = employeeRepository.create({
        employee_id: empData.employee_id,
        user_id: user?.id,
        first_name: empData.first_name,
        last_name: empData.last_name,
        work_email: empData.work_email,
        job_title: empData.job_title,
        job_level: empData.job_level,
        department_id: department?.id,
        employment_type: empData.employment_type,
        employment_status: empData.employment_status,
        hire_date: new Date(empData.hire_date),
        work_location: empData.work_location,
        is_remote: empData.is_remote,
      });
      await employeeRepository.save(employee);

      logger.info(`Created employee: ${empData.employee_id} - ${empData.first_name} ${empData.last_name}`);
    }

    // Create employee records for regular users
    logger.info('Creating regular employee records...');
    for (const empData of regularEmployees) {
      const existingEmp = await employeeRepository.findOne({ where: { employee_id: empData.employee_id } });
      if (existingEmp) {
        logger.info(`Employee ${empData.employee_id} already exists, skipping...`);
        continue;
      }

      const user = await userRepository.findOne({ where: { email: empData.work_email } });
      const department = deptMap.get(empData.department_code);

      const employee = employeeRepository.create({
        employee_id: empData.employee_id,
        user_id: user?.id,
        first_name: empData.first_name,
        last_name: empData.last_name,
        work_email: empData.work_email,
        job_title: empData.job_title,
        job_level: empData.job_level,
        department_id: department?.id,
        employment_type: empData.employment_type,
        employment_status: empData.employment_status,
        hire_date: new Date(empData.hire_date),
        work_location: empData.work_location,
        is_remote: empData.is_remote,
      });
      await employeeRepository.save(employee);

      logger.info(`Created employee: ${empData.employee_id} - ${empData.first_name} ${empData.last_name}`);
    }

    // Summary
    const totalUsers = await userRepository.count();
    const totalEmployees = await employeeRepository.count();
    const adminCount = await userRoleRepository.count({ where: { role_id: adminRole.id } });
    const managerCount = await userRoleRepository.count({ where: { role_id: managerRole.id } });
    const userCount = await userRoleRepository.count({ where: { role_id: userRole.id } });

    logger.info('=== Seed Complete ===');
    logger.info(`Total Users: ${totalUsers}`);
    logger.info(`  - Admins: ${adminCount}`);
    logger.info(`  - Managers: ${managerCount}`);
    logger.info(`  - Users: ${userCount}`);
    logger.info(`Total Employees: ${totalEmployees}`);

    await AppDataSource.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
