"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardEmployeeSchema = exports.terminateEmployeeSchema = exports.promoteEmployeeSchema = exports.transferEmployeeSchema = exports.updateLeaveBalanceSchema = exports.addDocumentSchema = exports.updatePerformanceGoalSchema = exports.addPerformanceGoalSchema = exports.addEducationSchema = exports.addCertificationSchema = exports.addSkillSchema = exports.bulkUpdateEmployeesSchema = exports.listEmployeesQuerySchema = exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const zod_1 = require("zod");
const Employee_1 = require("../entities/Employee");
// Helpers to handle empty strings from frontend for optional fields
const emptyToUndefined = (val) => (val === '' ? undefined : val);
const optionalString = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional());
const optionalUuid = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().uuid().optional());
const optionalEmail = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().email().optional());
const optionalUrl = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().url().optional());
// Skill schema
const skillSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    level: zod_1.z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    years_of_experience: zod_1.z.number().min(0).optional(),
    certified: zod_1.z.boolean().optional(),
});
// Certification schema
const certificationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    issuer: zod_1.z.string().min(1),
    issue_date: zod_1.z.string(),
    expiry_date: zod_1.z.string().optional(),
    credential_id: zod_1.z.string().optional(),
    credential_url: zod_1.z.string().url().optional(),
});
// Education schema
const educationSchema = zod_1.z.object({
    institution: zod_1.z.string().min(1),
    degree: zod_1.z.string().min(1),
    field_of_study: zod_1.z.string().min(1),
    start_date: zod_1.z.string(),
    end_date: zod_1.z.string().optional(),
    grade: zod_1.z.string().optional(),
});
// Emergency contact schema
const emergencyContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    relationship: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    is_primary: zod_1.z.boolean().default(false),
});
// Performance goal schema
const performanceGoalSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string(),
    target_date: zod_1.z.string(),
    status: zod_1.z.enum(['not_started', 'in_progress', 'completed', 'cancelled']).default('not_started'),
    progress_percentage: zod_1.z.number().min(0).max(100).default(0),
});
// Document schema
const documentSchema = zod_1.z.object({
    type: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    url: zod_1.z.string().url(),
    uploaded_at: zod_1.z.string().optional(),
    verified: zod_1.z.boolean().optional(),
});
// Create Employee Schema
exports.createEmployeeSchema = zod_1.z.object({
    // User linkage
    user_id: zod_1.z.string().uuid(),
    // Personal Information
    first_name: zod_1.z.string().min(1, 'First name is required'),
    middle_name: optionalString,
    last_name: zod_1.z.string().min(1, 'Last name is required'),
    date_of_birth: optionalString,
    gender: optionalString,
    nationality: optionalString,
    marital_status: optionalString,
    profile_picture_url: optionalUrl,
    // Contact Information
    work_email: zod_1.z.string().email('Invalid work email'),
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
    job_title: zod_1.z.string().min(1, 'Job title is required'),
    job_level: optionalString,
    employment_type: zod_1.z.nativeEnum(Employee_1.EmploymentType).default(Employee_1.EmploymentType.FULL_TIME),
    employment_status: zod_1.z.nativeEnum(Employee_1.EmploymentStatus).default(Employee_1.EmploymentStatus.ACTIVE),
    hire_date: zod_1.z.string().min(1, 'Hire date is required'),
    probation_end_date: optionalString,
    // Reporting Structure
    manager_id: optionalUuid,
    // Compensation
    base_salary: zod_1.z.number().min(0).optional(),
    salary_currency: zod_1.z.string().default('USD'),
    salary_frequency: zod_1.z.string().default('annual'),
    // Work Details
    work_location: optionalString,
    work_schedule: optionalString,
    timezone: optionalString,
    is_remote: zod_1.z.boolean().default(false),
    // Skills & Competencies
    skills: zod_1.z.array(skillSchema).optional(),
    certifications: zod_1.z.array(certificationSchema).optional(),
    education: zod_1.z.array(educationSchema).optional(),
    // Emergency Contact
    emergency_contacts: zod_1.z.array(emergencyContactSchema).optional(),
    // Tax Information
    tax_id: optionalString,
    tax_filing_status: optionalString,
    // Custom Fields
    custom_fields: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// Update Employee Schema
const optionalNullableString = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().nullable().optional());
const optionalNullableUuid = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().uuid().nullable().optional());
const optionalNullableEmail = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().email().nullable().optional());
const optionalNullableUrl = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().url().nullable().optional());
exports.updateEmployeeSchema = zod_1.z.object({
    // Personal Information
    first_name: zod_1.z.string().min(1).optional(),
    middle_name: optionalNullableString,
    last_name: zod_1.z.string().min(1).optional(),
    date_of_birth: optionalNullableString,
    gender: optionalNullableString,
    nationality: optionalNullableString,
    marital_status: optionalNullableString,
    profile_picture_url: optionalNullableUrl,
    // Contact Information
    work_email: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().email().optional()),
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
    job_title: zod_1.z.string().min(1).optional(),
    job_level: optionalNullableString,
    employment_type: zod_1.z.nativeEnum(Employee_1.EmploymentType).optional(),
    employment_status: zod_1.z.nativeEnum(Employee_1.EmploymentStatus).optional(),
    probation_end_date: optionalNullableString,
    termination_date: optionalNullableString,
    termination_reason: optionalNullableString,
    // Reporting Structure
    manager_id: optionalNullableUuid,
    // Compensation
    base_salary: zod_1.z.number().min(0).nullable().optional(),
    salary_currency: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    salary_frequency: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    // Work Details
    work_location: optionalNullableString,
    work_schedule: optionalNullableString,
    timezone: optionalNullableString,
    is_remote: zod_1.z.boolean().optional(),
    // Skills & Competencies
    skills: zod_1.z.array(skillSchema).optional(),
    certifications: zod_1.z.array(certificationSchema).optional(),
    education: zod_1.z.array(educationSchema).optional(),
    // Emergency Contact
    emergency_contacts: zod_1.z.array(emergencyContactSchema).optional(),
    // Documents
    documents: zod_1.z.array(documentSchema).optional(),
    // Performance
    performance_goals: zod_1.z.array(performanceGoalSchema).optional(),
    last_performance_rating: zod_1.z.number().min(0).max(5).optional(),
    last_review_date: optionalNullableString,
    next_review_date: optionalNullableString,
    // Leave Balances
    leave_balances: zod_1.z.array(zod_1.z.object({
        leave_type: zod_1.z.string(),
        total_days: zod_1.z.number(),
        used_days: zod_1.z.number(),
        pending_days: zod_1.z.number(),
        carry_forward_days: zod_1.z.number(),
    })).optional(),
    // Bank Details
    bank_details: zod_1.z.object({
        bank_name: zod_1.z.string(),
        account_number_masked: zod_1.z.string(),
        routing_number_masked: zod_1.z.string().optional(),
        account_type: zod_1.z.string(),
    }).nullable().optional(),
    // Tax Information
    tax_id: optionalNullableString,
    tax_filing_status: optionalNullableString,
    // Custom Fields
    custom_fields: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// List Employees Query Schema
exports.listEmployeesQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    department_id: zod_1.z.string().uuid().optional(),
    manager_id: zod_1.z.string().uuid().optional(),
    employment_status: zod_1.z.nativeEnum(Employee_1.EmploymentStatus).optional(),
    employment_type: zod_1.z.nativeEnum(Employee_1.EmploymentType).optional(),
    job_title: zod_1.z.string().optional(),
    job_level: zod_1.z.string().optional(),
    work_location: zod_1.z.string().optional(),
    is_remote: zod_1.z.coerce.boolean().optional(),
    hire_date_from: zod_1.z.string().optional(),
    hire_date_to: zod_1.z.string().optional(),
    sort_by: zod_1.z.enum(['first_name', 'last_name', 'hire_date', 'job_title', 'department', 'created_at']).default('created_at'),
    sort_order: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
// Bulk Update Schema
exports.bulkUpdateEmployeesSchema = zod_1.z.object({
    employee_ids: zod_1.z.array(zod_1.z.string().uuid()).min(1),
    updates: zod_1.z.object({
        department_id: zod_1.z.string().uuid().optional(),
        manager_id: zod_1.z.string().uuid().optional(),
        employment_status: zod_1.z.nativeEnum(Employee_1.EmploymentStatus).optional(),
        work_location: zod_1.z.string().optional(),
        is_remote: zod_1.z.boolean().optional(),
    }),
});
// Add Skill Schema
exports.addSkillSchema = skillSchema;
// Add Certification Schema
exports.addCertificationSchema = certificationSchema;
// Add Education Schema
exports.addEducationSchema = educationSchema;
// Add Performance Goal Schema
exports.addPerformanceGoalSchema = performanceGoalSchema;
// Update Performance Goal Schema
exports.updatePerformanceGoalSchema = zod_1.z.object({
    goal_id: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    target_date: zod_1.z.string().optional(),
    status: zod_1.z.enum(['not_started', 'in_progress', 'completed', 'cancelled']).optional(),
    progress_percentage: zod_1.z.number().min(0).max(100).optional(),
});
// Add Document Schema
exports.addDocumentSchema = documentSchema;
// Update Leave Balance Schema
exports.updateLeaveBalanceSchema = zod_1.z.object({
    leave_type: zod_1.z.string().min(1),
    total_days: zod_1.z.number().min(0).optional(),
    used_days: zod_1.z.number().min(0).optional(),
    pending_days: zod_1.z.number().min(0).optional(),
    carry_forward_days: zod_1.z.number().min(0).optional(),
});
// Transfer Employee Schema
exports.transferEmployeeSchema = zod_1.z.object({
    new_department_id: zod_1.z.string().uuid(),
    new_job_title: zod_1.z.string().optional(),
    new_job_level: zod_1.z.string().optional(),
    new_manager_id: zod_1.z.string().uuid().optional(),
    new_salary: zod_1.z.number().min(0).optional(),
    effective_date: zod_1.z.string(),
    reason: zod_1.z.string().optional(),
});
// Promote Employee Schema
exports.promoteEmployeeSchema = zod_1.z.object({
    new_job_title: zod_1.z.string().min(1),
    new_job_level: zod_1.z.string().optional(),
    new_salary: zod_1.z.number().min(0).optional(),
    effective_date: zod_1.z.string(),
    reason: zod_1.z.string().optional(),
});
// Terminate Employee Schema
exports.terminateEmployeeSchema = zod_1.z.object({
    termination_date: zod_1.z.string(),
    termination_reason: zod_1.z.string().min(1),
    last_working_date: zod_1.z.string().optional(),
    eligible_for_rehire: zod_1.z.boolean().default(true),
    exit_interview_completed: zod_1.z.boolean().default(false),
    notes: zod_1.z.string().optional(),
});
// Onboard Employee Schema
exports.onboardEmployeeSchema = zod_1.z.object({
    employee_id: zod_1.z.string().uuid(),
    onboarding_tasks: zod_1.z.array(zod_1.z.object({
        task: zod_1.z.string(),
        completed: zod_1.z.boolean().default(false),
        completed_at: zod_1.z.string().optional(),
    })),
    equipment_assigned: zod_1.z.array(zod_1.z.object({
        item: zod_1.z.string(),
        serial_number: zod_1.z.string().optional(),
        assigned_at: zod_1.z.string(),
    })).optional(),
    access_granted: zod_1.z.array(zod_1.z.string()).optional(),
    buddy_assigned: zod_1.z.string().uuid().optional(),
    orientation_date: zod_1.z.string().optional(),
});
//# sourceMappingURL=employee.dto.js.map