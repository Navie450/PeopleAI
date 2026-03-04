import 'reflect-metadata';
import { AppDataSource } from '../../config/database';
import { Department } from '../../entities/Department';
import { Employee, EmploymentType, EmploymentStatus } from '../../entities/Employee';
import { logger } from '../../utils/logger';

const seed = async () => {
  try {
    logger.info('Starting employee-service seed...');

    await AppDataSource.initialize();
    logger.info('Database connection established');

    const departmentRepository = AppDataSource.getRepository(Department);
    const employeeRepository = AppDataSource.getRepository(Employee);

    // ── Seed Departments ────────────────────────────────────────
    const existingDepts = await departmentRepository.count();
    if (existingDepts > 0) {
      logger.info('Departments already exist, skipping department seed');
    } else {
      const departments = [
        {
          name: 'Engineering',
          code: 'ENG',
          description: 'Software Engineering and Development',
          location: 'San Francisco, CA',
          is_active: true,
        },
        {
          name: 'Product',
          code: 'PRD',
          description: 'Product Management and Design',
          location: 'New York, NY',
          is_active: true,
        },
        {
          name: 'Human Resources',
          code: 'HR',
          description: 'People Operations and HR Management',
          location: 'San Francisco, CA',
          is_active: true,
        },
        {
          name: 'Finance',
          code: 'FIN',
          description: 'Financial Planning and Analysis',
          location: 'New York, NY',
          is_active: true,
        },
        {
          name: 'Marketing',
          code: 'MKT',
          description: 'Marketing and Brand Strategy',
          location: 'Los Angeles, CA',
          is_active: true,
        },
        {
          name: 'Sales',
          code: 'SLS',
          description: 'Sales and Business Development',
          location: 'Chicago, IL',
          is_active: true,
        },
      ];

      await departmentRepository.save(departments);
      logger.info(`Seeded ${departments.length} departments`);
    }

    // ── Seed Employees ──────────────────────────────────────────
    const existingEmployees = await employeeRepository.count();
    if (existingEmployees > 0) {
      logger.info('Employees already exist, skipping employee seed');
    } else {
      const departments = await departmentRepository.find();
      const deptMap = new Map(departments.map((d) => [d.code, d]));

      const employees = [
        {
          employee_id: 'EMP001',
          first_name: 'Admin',
          last_name: 'User',
          work_email: 'admin@peopleai.com',
          job_title: 'System Administrator',
          job_level: 'Senior',
          department_code: 'ENG',
          employment_type: EmploymentType.FULL_TIME,
          employment_status: EmploymentStatus.ACTIVE,
          hire_date: '2021-01-01',
          work_location: 'San Francisco, CA',
          is_remote: false,
        },
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

      for (const empData of employees) {
        const department = deptMap.get(empData.department_code);

        const employee = employeeRepository.create({
          employee_id: empData.employee_id,
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
    }

    // ── Summary ─────────────────────────────────────────────────
    const totalDepts = await departmentRepository.count();
    const totalEmployees = await employeeRepository.count();

    logger.info('=== Employee Seed Complete ===');
    logger.info(`Departments: ${totalDepts}, Employees: ${totalEmployees}`);
    logger.info('Note: Run auth-service seed first, then link users to employees via the admin UI');

    await AppDataSource.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error seeding employee database:', error);
    process.exit(1);
  }
};

seed();
