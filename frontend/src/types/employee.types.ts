// Employment Status
export type EmploymentStatus =
  | 'active'
  | 'on_leave'
  | 'probation'
  | 'notice_period'
  | 'terminated'
  | 'resigned'
  | 'retired'

// Employment Type
export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'intern'
  | 'freelance'
  | 'temporary'

// Skill
export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  years_of_experience?: number
  certified?: boolean
}

// Certification
export interface Certification {
  name: string
  issuer: string
  issue_date: string
  expiry_date?: string
  credential_id?: string
  credential_url?: string
}

// Education
export interface Education {
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date?: string
  grade?: string
}

// Emergency Contact
export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
  is_primary: boolean
}

// Leave Balance
export interface LeaveBalance {
  leave_type: string
  total_days: number
  used_days: number
  pending_days: number
  carry_forward_days: number
}

// Document
export interface EmployeeDocument {
  type: string
  name: string
  url: string
  uploaded_at: string
  verified?: boolean
}

// Performance Goal
export interface PerformanceGoal {
  id: string
  title: string
  description: string
  target_date: string
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  progress_percentage: number
  created_at: string
  updated_at: string
}

// Employment History Entry
export interface EmploymentHistoryEntry {
  job_title: string
  department: string
  start_date: string
  end_date?: string
  reason_for_change?: string
}

// Employee List Item (for tables/grids)
export interface EmployeeListItem {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  full_name: string
  work_email: string
  job_title: string
  job_level?: string
  department?: {
    id: string
    name: string
  }
  manager?: {
    id: string
    full_name: string
  }
  employment_status: EmploymentStatus
  employment_type: EmploymentType
  hire_date: string
  work_location?: string
  is_remote: boolean
  profile_picture_url?: string
  created_at: string
}

// Employee Detail (full profile)
export interface Employee extends EmployeeListItem {
  middle_name?: string
  date_of_birth?: string
  gender?: string
  nationality?: string
  marital_status?: string
  personal_email?: string
  work_phone?: string
  personal_phone?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  probation_end_date?: string
  termination_date?: string
  termination_reason?: string
  base_salary?: number
  salary_currency: string
  salary_frequency: string
  work_schedule?: string
  timezone?: string
  skills?: Skill[]
  certifications?: Certification[]
  education?: Education[]
  emergency_contacts?: EmergencyContact[]
  leave_balances?: LeaveBalance[]
  documents?: EmployeeDocument[]
  performance_goals?: PerformanceGoal[]
  last_performance_rating?: number
  last_review_date?: string
  next_review_date?: string
  employment_history?: EmploymentHistoryEntry[]
  direct_reports_count?: number
  years_of_service: number
  updated_at: string
}

// Create Employee DTO
export interface CreateEmployeeDto {
  user_id: string
  first_name: string
  middle_name?: string
  last_name: string
  date_of_birth?: string
  gender?: string
  nationality?: string
  marital_status?: string
  profile_picture_url?: string
  work_email: string
  personal_email?: string
  work_phone?: string
  personal_phone?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  department_id?: string
  job_title: string
  job_level?: string
  employment_type?: EmploymentType
  employment_status?: EmploymentStatus
  hire_date: string
  probation_end_date?: string
  manager_id?: string
  base_salary?: number
  salary_currency?: string
  salary_frequency?: string
  work_location?: string
  work_schedule?: string
  timezone?: string
  is_remote?: boolean
  skills?: Skill[]
  certifications?: Certification[]
  education?: Education[]
  emergency_contacts?: EmergencyContact[]
  tax_id?: string
  tax_filing_status?: string
}

// Update Employee DTO
export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  termination_date?: string
  termination_reason?: string
  documents?: EmployeeDocument[]
  performance_goals?: PerformanceGoal[]
  last_performance_rating?: number
  last_review_date?: string
  next_review_date?: string
  leave_balances?: LeaveBalance[]
}

// List Employees Query
export interface ListEmployeesQuery {
  page?: number
  limit?: number
  search?: string
  department_id?: string
  manager_id?: string
  employment_status?: EmploymentStatus
  employment_type?: EmploymentType
  job_title?: string
  job_level?: string
  work_location?: string
  is_remote?: boolean
  hire_date_from?: string
  hire_date_to?: string
  sort_by?: 'first_name' | 'last_name' | 'hire_date' | 'job_title' | 'department' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

// Bulk Update DTO
export interface BulkUpdateEmployeesDto {
  employee_ids: string[]
  updates: {
    department_id?: string
    manager_id?: string
    employment_status?: EmploymentStatus
    work_location?: string
    is_remote?: boolean
  }
}

// Transfer Employee DTO
export interface TransferEmployeeDto {
  new_department_id: string
  new_job_title?: string
  new_job_level?: string
  new_manager_id?: string
  new_salary?: number
  effective_date: string
  reason?: string
}

// Promote Employee DTO
export interface PromoteEmployeeDto {
  new_job_title: string
  new_job_level?: string
  new_salary?: number
  effective_date: string
  reason?: string
}

// Terminate Employee DTO
export interface TerminateEmployeeDto {
  termination_date: string
  termination_reason: string
  last_working_date?: string
  eligible_for_rehire?: boolean
  exit_interview_completed?: boolean
  notes?: string
}

// Employee Analytics
export interface EmployeeAnalytics {
  total_employees: number
  active_employees: number
  by_status: Record<string, number>
  by_type: Record<string, number>
  by_department: Array<{
    department_id: string
    department_name: string
    count: number
  }>
  by_location: Array<{
    location: string
    count: number
  }>
  remote_vs_onsite: {
    remote: number
    onsite: number
  }
  average_tenure_years: number
  new_hires_this_month: number
  terminations_this_month: number
  upcoming_reviews: number
  probation_ending_soon: number
}

// Org Chart Node
export interface OrgChartNode {
  id: string
  employee_id: string
  full_name: string
  job_title: string
  department?: string
  profile_picture_url?: string
  direct_reports?: OrgChartNode[]
}
