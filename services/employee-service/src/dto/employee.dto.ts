import { z } from 'zod';
import { EmploymentStatus, EmploymentType } from '../entities/Employee';

// Helpers to handle empty strings from frontend for optional fields
const emptyToUndefined = (val: unknown) => (val === '' ? undefined : val);

const optionalString = z.preprocess(emptyToUndefined, z.string().optional());
const optionalUuid = z.preprocess(emptyToUndefined, z.string().uuid().optional());
const optionalEmail = z.preprocess(emptyToUndefined, z.string().email().optional());
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());

// Skill schema
const skillSchema = z.object({
  name: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  years_of_experience: z.number().min(0).optional(),
  certified: z.boolean().optional(),
});

// Certification schema
const certificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  issue_date: z.string(),
  expiry_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().url().optional(),
});

// Education schema
const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field_of_study: z.string().min(1),
  start_date: z.string(),
  end_date: z.string().optional(),
  grade: z.string().optional(),
});

// Emergency contact schema
const emergencyContactSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  is_primary: z.boolean().default(false),
});

// Performance goal schema
const performanceGoalSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string(),
  target_date: z.string(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'cancelled']).default('not_started'),
  progress_percentage: z.number().min(0).max(100).default(0),
});

// Document schema
const documentSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  uploaded_at: z.string().optional(),
  verified: z.boolean().optional(),
});

// Create Employee Schema
export const createEmployeeSchema = z.object({
  // User linkage
  user_id: z.string().uuid(),

  // Personal Information
  first_name: z.string().min(1, 'First name is required'),
  middle_name: optionalString,
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: optionalString,
  gender: optionalString,
  nationality: optionalString,
  marital_status: optionalString,
  profile_picture_url: optionalUrl,

  // Contact Information
  work_email: z.string().email('Invalid work email'),
  personal_email: optionalEmail,
  work_phone: optionalString,
  personal_phone: optionalString,

  // Address
  address_line1: optionalString,
  address_line2: optionalString,
  city: optionalString,
  state: optionalString,
  postal_code: optionalString,
  country: optionalString,

  // Employment Details
  department_id: optionalUuid,
  job_title: z.string().min(1, 'Job title is required'),
  job_level: optionalString,
  employment_type: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
  employment_status: z.nativeEnum(EmploymentStatus).default(EmploymentStatus.ACTIVE),
  hire_date: z.string().min(1, 'Hire date is required'),
  probation_end_date: optionalString,

  // Reporting Structure
  manager_id: optionalUuid,

  // Compensation
  base_salary: z.number().min(0).optional(),
  salary_currency: z.string().default('USD'),
  salary_frequency: z.string().default('annual'),

  // Work Details
  work_location: optionalString,
  work_schedule: optionalString,
  timezone: optionalString,
  is_remote: z.boolean().default(false),

  // Skills & Competencies
  skills: z.array(skillSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  education: z.array(educationSchema).optional(),

  // Emergency Contact
  emergency_contacts: z.array(emergencyContactSchema).optional(),

  // Tax Information
  tax_id: optionalString,
  tax_filing_status: optionalString,

  // Custom Fields
  custom_fields: z.record(z.unknown()).optional(),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;

// Update Employee Schema
const optionalNullableString = z.preprocess(emptyToUndefined, z.string().nullable().optional());
const optionalNullableUuid = z.preprocess(emptyToUndefined, z.string().uuid().nullable().optional());
const optionalNullableEmail = z.preprocess(emptyToUndefined, z.string().email().nullable().optional());
const optionalNullableUrl = z.preprocess(emptyToUndefined, z.string().url().nullable().optional());

export const updateEmployeeSchema = z.object({
  // Personal Information
  first_name: z.string().min(1).optional(),
  middle_name: optionalNullableString,
  last_name: z.string().min(1).optional(),
  date_of_birth: optionalNullableString,
  gender: optionalNullableString,
  nationality: optionalNullableString,
  marital_status: optionalNullableString,
  profile_picture_url: optionalNullableUrl,

  // Contact Information
  work_email: z.preprocess(emptyToUndefined, z.string().email().optional()),
  personal_email: optionalNullableEmail,
  work_phone: optionalNullableString,
  personal_phone: optionalNullableString,

  // Address
  address_line1: optionalNullableString,
  address_line2: optionalNullableString,
  city: optionalNullableString,
  state: optionalNullableString,
  postal_code: optionalNullableString,
  country: optionalNullableString,

  // Employment Details
  department_id: optionalNullableUuid,
  job_title: z.string().min(1).optional(),
  job_level: optionalNullableString,
  employment_type: z.nativeEnum(EmploymentType).optional(),
  employment_status: z.nativeEnum(EmploymentStatus).optional(),
  probation_end_date: optionalNullableString,
  termination_date: optionalNullableString,
  termination_reason: optionalNullableString,

  // Reporting Structure
  manager_id: optionalNullableUuid,

  // Compensation
  base_salary: z.number().min(0).nullable().optional(),
  salary_currency: z.preprocess(emptyToUndefined, z.string().optional()),
  salary_frequency: z.preprocess(emptyToUndefined, z.string().optional()),

  // Work Details
  work_location: optionalNullableString,
  work_schedule: optionalNullableString,
  timezone: optionalNullableString,
  is_remote: z.boolean().optional(),

  // Skills & Competencies
  skills: z.array(skillSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  education: z.array(educationSchema).optional(),

  // Emergency Contact
  emergency_contacts: z.array(emergencyContactSchema).optional(),

  // Documents
  documents: z.array(documentSchema).optional(),

  // Performance
  performance_goals: z.array(performanceGoalSchema).optional(),
  last_performance_rating: z.number().min(0).max(5).optional(),
  last_review_date: optionalNullableString,
  next_review_date: optionalNullableString,

  // Leave Balances
  leave_balances: z.array(z.object({
    leave_type: z.string(),
    total_days: z.number(),
    used_days: z.number(),
    pending_days: z.number(),
    carry_forward_days: z.number(),
  })).optional(),

  // Bank Details
  bank_details: z.object({
    bank_name: z.string(),
    account_number_masked: z.string(),
    routing_number_masked: z.string().optional(),
    account_type: z.string(),
  }).nullable().optional(),

  // Tax Information
  tax_id: optionalNullableString,
  tax_filing_status: optionalNullableString,

  // Custom Fields
  custom_fields: z.record(z.unknown()).optional(),
});

export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;

// List Employees Query Schema
export const listEmployeesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  department_id: z.string().uuid().optional(),
  manager_id: z.string().uuid().optional(),
  employment_status: z.nativeEnum(EmploymentStatus).optional(),
  employment_type: z.nativeEnum(EmploymentType).optional(),
  job_title: z.string().optional(),
  job_level: z.string().optional(),
  work_location: z.string().optional(),
  is_remote: z.coerce.boolean().optional(),
  hire_date_from: z.string().optional(),
  hire_date_to: z.string().optional(),
  sort_by: z.enum(['first_name', 'last_name', 'hire_date', 'job_title', 'department', 'created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;

// Bulk Update Schema
export const bulkUpdateEmployeesSchema = z.object({
  employee_ids: z.array(z.string().uuid()).min(1),
  updates: z.object({
    department_id: z.string().uuid().optional(),
    manager_id: z.string().uuid().optional(),
    employment_status: z.nativeEnum(EmploymentStatus).optional(),
    work_location: z.string().optional(),
    is_remote: z.boolean().optional(),
  }),
});

export type BulkUpdateEmployeesDto = z.infer<typeof bulkUpdateEmployeesSchema>;

// Add Skill Schema
export const addSkillSchema = skillSchema;
export type AddSkillDto = z.infer<typeof addSkillSchema>;

// Add Certification Schema
export const addCertificationSchema = certificationSchema;
export type AddCertificationDto = z.infer<typeof addCertificationSchema>;

// Add Education Schema
export const addEducationSchema = educationSchema;
export type AddEducationDto = z.infer<typeof addEducationSchema>;

// Add Performance Goal Schema
export const addPerformanceGoalSchema = performanceGoalSchema;
export type AddPerformanceGoalDto = z.infer<typeof addPerformanceGoalSchema>;

// Update Performance Goal Schema
export const updatePerformanceGoalSchema = z.object({
  goal_id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  target_date: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'cancelled']).optional(),
  progress_percentage: z.number().min(0).max(100).optional(),
});

export type UpdatePerformanceGoalDto = z.infer<typeof updatePerformanceGoalSchema>;

// Add Document Schema
export const addDocumentSchema = documentSchema;
export type AddDocumentDto = z.infer<typeof addDocumentSchema>;

// Update Leave Balance Schema
export const updateLeaveBalanceSchema = z.object({
  leave_type: z.string().min(1),
  total_days: z.number().min(0).optional(),
  used_days: z.number().min(0).optional(),
  pending_days: z.number().min(0).optional(),
  carry_forward_days: z.number().min(0).optional(),
});

export type UpdateLeaveBalanceDto = z.infer<typeof updateLeaveBalanceSchema>;

// Transfer Employee Schema
export const transferEmployeeSchema = z.object({
  new_department_id: z.string().uuid(),
  new_job_title: z.string().optional(),
  new_job_level: z.string().optional(),
  new_manager_id: z.string().uuid().optional(),
  new_salary: z.number().min(0).optional(),
  effective_date: z.string(),
  reason: z.string().optional(),
});

export type TransferEmployeeDto = z.infer<typeof transferEmployeeSchema>;

// Promote Employee Schema
export const promoteEmployeeSchema = z.object({
  new_job_title: z.string().min(1),
  new_job_level: z.string().optional(),
  new_salary: z.number().min(0).optional(),
  effective_date: z.string(),
  reason: z.string().optional(),
});

export type PromoteEmployeeDto = z.infer<typeof promoteEmployeeSchema>;

// Terminate Employee Schema
export const terminateEmployeeSchema = z.object({
  termination_date: z.string(),
  termination_reason: z.string().min(1),
  last_working_date: z.string().optional(),
  eligible_for_rehire: z.boolean().default(true),
  exit_interview_completed: z.boolean().default(false),
  notes: z.string().optional(),
});

export type TerminateEmployeeDto = z.infer<typeof terminateEmployeeSchema>;

// Onboard Employee Schema
export const onboardEmployeeSchema = z.object({
  employee_id: z.string().uuid(),
  onboarding_tasks: z.array(z.object({
    task: z.string(),
    completed: z.boolean().default(false),
    completed_at: z.string().optional(),
  })),
  equipment_assigned: z.array(z.object({
    item: z.string(),
    serial_number: z.string().optional(),
    assigned_at: z.string(),
  })).optional(),
  access_granted: z.array(z.string()).optional(),
  buddy_assigned: z.string().uuid().optional(),
  orientation_date: z.string().optional(),
});

export type OnboardEmployeeDto = z.infer<typeof onboardEmployeeSchema>;

// Response Interfaces
export interface EmployeeListItemResponse {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  work_email: string;
  job_title: string;
  job_level?: string;
  department?: {
    id: string;
    name: string;
  };
  manager?: {
    id: string;
    full_name: string;
  };
  employment_status: EmploymentStatus;
  employment_type: EmploymentType;
  hire_date: Date;
  work_location?: string;
  is_remote: boolean;
  profile_picture_url?: string;
  created_at: Date;
}

export interface EmployeeDetailResponse extends EmployeeListItemResponse {
  middle_name?: string;
  date_of_birth?: Date;
  gender?: string;
  nationality?: string;
  marital_status?: string;
  personal_email?: string;
  work_phone?: string;
  personal_phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  probation_end_date?: Date;
  termination_date?: Date;
  termination_reason?: string;
  base_salary?: number;
  salary_currency: string;
  salary_frequency: string;
  work_schedule?: string;
  timezone?: string;
  skills?: Array<{
    name: string;
    level: string;
    years_of_experience?: number;
    certified?: boolean;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
    credential_url?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
    grade?: string;
  }>;
  emergency_contacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    is_primary: boolean;
  }>;
  leave_balances?: Array<{
    leave_type: string;
    total_days: number;
    used_days: number;
    pending_days: number;
    carry_forward_days: number;
  }>;
  documents?: Array<{
    type: string;
    name: string;
    url: string;
    uploaded_at: string;
    verified?: boolean;
  }>;
  performance_goals?: Array<{
    id: string;
    title: string;
    description: string;
    target_date: string;
    status: string;
    progress_percentage: number;
    created_at: string;
    updated_at: string;
  }>;
  last_performance_rating?: number;
  last_review_date?: Date;
  next_review_date?: Date;
  employment_history?: Array<{
    job_title: string;
    department: string;
    start_date: string;
    end_date?: string;
    reason_for_change?: string;
  }>;
  direct_reports_count?: number;
  years_of_service: number;
  updated_at: Date;
}

// Analytics Response Interfaces
export interface EmployeeAnalytics {
  total_employees: number;
  active_employees: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
  by_department: Array<{
    department_id: string;
    department_name: string;
    count: number;
  }>;
  by_location: Array<{
    location: string;
    count: number;
  }>;
  remote_vs_onsite: {
    remote: number;
    onsite: number;
  };
  average_tenure_years: number;
  new_hires_this_month: number;
  terminations_this_month: number;
  upcoming_reviews: number;
  probation_ending_soon: number;
}

export interface OrgChartNode {
  id: string;
  employee_id: string;
  full_name: string;
  job_title: string;
  department?: string;
  profile_picture_url?: string;
  direct_reports?: OrgChartNode[];
}
