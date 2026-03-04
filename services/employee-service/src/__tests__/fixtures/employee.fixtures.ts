import { EmploymentStatus, EmploymentType } from '../../entities/Employee';

const uuid1 = '550e8400-e29b-41d4-a716-446655440001';
const uuid2 = '550e8400-e29b-41d4-a716-446655440002';
const uuid3 = '550e8400-e29b-41d4-a716-446655440003';
const deptUuid = '660e8400-e29b-41d4-a716-446655440001';
const userUuid = '770e8400-e29b-41d4-a716-446655440001';

export const createMockEmployee = (overrides: Record<string, unknown> = {}) => ({
  id: uuid1,
  employee_id: 'EMP001',
  user_id: userUuid,
  first_name: 'John',
  middle_name: null,
  last_name: 'Doe',
  work_email: 'john.doe@company.com',
  personal_email: 'john@gmail.com',
  work_phone: '+1234567890',
  personal_phone: null,
  job_title: 'Software Engineer',
  job_level: 'Senior',
  department_id: deptUuid,
  department: { id: deptUuid, name: 'Engineering' },
  manager_id: uuid2,
  manager: { id: uuid2, first_name: 'Jane', last_name: 'Smith' },
  direct_reports: [],
  employment_status: EmploymentStatus.ACTIVE,
  employment_type: EmploymentType.FULL_TIME,
  hire_date: new Date('2022-01-15'),
  date_of_birth: new Date('1990-05-20'),
  gender: 'male',
  nationality: 'US',
  marital_status: 'single',
  profile_picture_url: null,
  address_line1: '123 Main St',
  address_line2: null,
  city: 'San Francisco',
  state: 'CA',
  postal_code: '94102',
  country: 'US',
  probation_end_date: null,
  termination_date: null,
  termination_reason: null,
  base_salary: 120000,
  salary_currency: 'USD',
  salary_frequency: 'annual',
  work_location: 'San Francisco',
  work_schedule: '9-5',
  timezone: 'America/Los_Angeles',
  is_remote: false,
  skills: [
    { name: 'TypeScript', level: 'expert', years_of_experience: 5, certified: false },
    { name: 'React', level: 'advanced', years_of_experience: 4, certified: false },
  ],
  certifications: [],
  education: [
    { institution: 'MIT', degree: 'BS', field_of_study: 'Computer Science', start_date: '2008-09-01', end_date: '2012-06-01' },
  ],
  emergency_contacts: [
    { name: 'Jane Doe', relationship: 'Spouse', phone: '+1987654321', email: 'jane@gmail.com', is_primary: true },
  ],
  leave_balances: [
    { leave_type: 'annual', total_days: 20, used_days: 5, pending_days: 0, carry_forward_days: 2 },
  ],
  documents: [],
  performance_goals: [
    {
      id: '880e8400-e29b-41d4-a716-446655440001',
      title: 'Complete project X',
      description: 'Finish the main deliverables',
      target_date: '2024-06-30',
      status: 'in_progress',
      progress_percentage: 60,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
    },
  ],
  employment_history: [],
  bank_details: null,
  custom_fields: {},
  metadata: {},
  last_performance_rating: 4.2,
  last_review_date: new Date('2023-12-01'),
  next_review_date: new Date('2024-12-01'),
  tax_id: null,
  tax_filing_status: null,
  deleted_at: null,
  created_at: new Date('2022-01-15'),
  updated_at: new Date('2024-01-01'),
  ...overrides,
});

export const createMockDepartment = (overrides: Record<string, unknown> = {}) => ({
  id: deptUuid,
  name: 'Engineering',
  code: 'ENG',
  description: 'Engineering department',
  parent_id: null,
  manager_id: uuid2,
  location: 'San Francisco',
  budget: 1000000,
  metadata: {},
  is_active: true,
  deleted_at: null,
  created_at: new Date('2022-01-01'),
  updated_at: new Date('2024-01-01'),
  ...overrides,
});

export const createMockCreateEmployeeDto = (overrides: Record<string, unknown> = {}) => ({
  user_id: userUuid,
  first_name: 'John',
  last_name: 'Doe',
  work_email: 'john.doe@company.com',
  job_title: 'Software Engineer',
  hire_date: '2022-01-15',
  employment_type: EmploymentType.FULL_TIME,
  employment_status: EmploymentStatus.ACTIVE,
  salary_currency: 'USD',
  salary_frequency: 'annual',
  is_remote: false,
  ...overrides,
});

export const createMockTransferDto = (overrides: Record<string, unknown> = {}) => ({
  new_department_id: '660e8400-e29b-41d4-a716-446655440002',
  effective_date: '2024-06-01',
  reason: 'Team restructuring',
  ...overrides,
});

export const createMockPromoteDto = (overrides: Record<string, unknown> = {}) => ({
  new_job_title: 'Senior Software Engineer',
  new_job_level: 'Staff',
  new_salary: 150000,
  effective_date: '2024-06-01',
  reason: 'Excellent performance',
  ...overrides,
});

export const createMockTerminateDto = (overrides: Record<string, unknown> = {}) => ({
  termination_date: '2024-06-01',
  termination_reason: 'Voluntary resignation',
  eligible_for_rehire: true,
  exit_interview_completed: false,
  ...overrides,
});

export { uuid1, uuid2, uuid3, deptUuid, userUuid };
