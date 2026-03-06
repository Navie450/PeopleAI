import { z } from 'zod';
import { EmploymentStatus, EmploymentType } from '../entities/Employee';
export declare const createEmployeeSchema: z.ZodObject<{
    user_id: z.ZodString;
    first_name: z.ZodString;
    middle_name: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    last_name: z.ZodString;
    date_of_birth: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    gender: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    nationality: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    marital_status: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    profile_picture_url: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    work_email: z.ZodString;
    personal_email: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    work_phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    personal_phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    address_line1: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    address_line2: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    city: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    state: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    postal_code: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    country: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    department_id: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    job_title: z.ZodString;
    job_level: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    employment_type: z.ZodDefault<z.ZodNativeEnum<typeof EmploymentType>>;
    employment_status: z.ZodDefault<z.ZodNativeEnum<typeof EmploymentStatus>>;
    hire_date: z.ZodString;
    probation_end_date: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    manager_id: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    base_salary: z.ZodOptional<z.ZodNumber>;
    salary_currency: z.ZodDefault<z.ZodString>;
    salary_frequency: z.ZodDefault<z.ZodString>;
    work_location: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    work_schedule: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    timezone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    is_remote: z.ZodDefault<z.ZodBoolean>;
    skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        level: z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>;
        years_of_experience: z.ZodOptional<z.ZodNumber>;
        certified: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        level: "beginner" | "intermediate" | "advanced" | "expert";
        name: string;
        years_of_experience?: number | undefined;
        certified?: boolean | undefined;
    }, {
        level: "beginner" | "intermediate" | "advanced" | "expert";
        name: string;
        years_of_experience?: number | undefined;
        certified?: boolean | undefined;
    }>, "many">>;
    certifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        issuer: z.ZodString;
        issue_date: z.ZodString;
        expiry_date: z.ZodOptional<z.ZodString>;
        credential_id: z.ZodOptional<z.ZodString>;
        credential_url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string | undefined;
        credential_id?: string | undefined;
        credential_url?: string | undefined;
    }, {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string | undefined;
        credential_id?: string | undefined;
        credential_url?: string | undefined;
    }>, "many">>;
    education: z.ZodOptional<z.ZodArray<z.ZodObject<{
        institution: z.ZodString;
        degree: z.ZodString;
        field_of_study: z.ZodString;
        start_date: z.ZodString;
        end_date: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        start_date: string;
        institution: string;
        degree: string;
        field_of_study: string;
        end_date?: string | undefined;
        grade?: string | undefined;
    }, {
        start_date: string;
        institution: string;
        degree: string;
        field_of_study: string;
        end_date?: string | undefined;
        grade?: string | undefined;
    }>, "many">>;
    emergency_contacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        relationship: z.ZodString;
        phone: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        is_primary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        relationship: string;
        phone: string;
        is_primary: boolean;
        email?: string | undefined;
    }, {
        name: string;
        relationship: string;
        phone: string;
        email?: string | undefined;
        is_primary?: boolean | undefined;
    }>, "many">>;
    tax_id: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    tax_filing_status: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    custom_fields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    first_name: string;
    last_name: string;
    work_email: string;
    job_title: string;
    employment_type: EmploymentType;
    employment_status: EmploymentStatus;
    hire_date: string;
    salary_currency: string;
    salary_frequency: string;
    is_remote: boolean;
    manager_id?: string | undefined;
    middle_name?: string | undefined;
    date_of_birth?: string | undefined;
    gender?: string | undefined;
    nationality?: string | undefined;
    marital_status?: string | undefined;
    profile_picture_url?: string | undefined;
    personal_email?: string | undefined;
    work_phone?: string | undefined;
    personal_phone?: string | undefined;
    address_line1?: string | undefined;
    address_line2?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postal_code?: string | undefined;
    country?: string | undefined;
    department_id?: string | undefined;
    job_level?: string | undefined;
    probation_end_date?: string | undefined;
    base_salary?: number | undefined;
    work_location?: string | undefined;
    work_schedule?: string | undefined;
    timezone?: string | undefined;
    skills?: {
        level: "beginner" | "intermediate" | "advanced" | "expert";
        name: string;
        years_of_experience?: number | undefined;
        certified?: boolean | undefined;
    }[] | undefined;
    certifications?: {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string | undefined;
        credential_id?: string | undefined;
        credential_url?: string | undefined;
    }[] | undefined;
    education?: {
        start_date: string;
        institution: string;
        degree: string;
        field_of_study: string;
        end_date?: string | undefined;
        grade?: string | undefined;
    }[] | undefined;
    emergency_contacts?: {
        name: string;
        relationship: string;
        phone: string;
        is_primary: boolean;
        email?: string | undefined;
    }[] | undefined;
    tax_id?: string | undefined;
    tax_filing_status?: string | undefined;
    custom_fields?: Record<string, unknown> | undefined;
}, {
    user_id: string;
    first_name: string;
    last_name: string;
    work_email: string;
    job_title: string;
    hire_date: string;
    manager_id?: unknown;
    middle_name?: unknown;
    date_of_birth?: unknown;
    gender?: unknown;
    nationality?: unknown;
    marital_status?: unknown;
    profile_picture_url?: unknown;
    personal_email?: unknown;
    work_phone?: unknown;
    personal_phone?: unknown;
    address_line1?: unknown;
    address_line2?: unknown;
    city?: unknown;
    state?: unknown;
    postal_code?: unknown;
    country?: unknown;
    department_id?: unknown;
    job_level?: unknown;
    employment_type?: EmploymentType | undefined;
    employment_status?: EmploymentStatus | undefined;
    probation_end_date?: unknown;
    base_salary?: number | undefined;
    salary_currency?: string | undefined;
    salary_frequency?: string | undefined;
    work_location?: unknown;
    work_schedule?: unknown;
    timezone?: unknown;
    is_remote?: boolean | undefined;
    skills?: {
        level: "beginner" | "intermediate" | "advanced" | "expert";
        name: string;
        years_of_experience?: number | undefined;
        certified?: boolean | undefined;
    }[] | undefined;
    certifications?: {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string | undefined;
        credential_id?: string | undefined;
        credential_url?: string | undefined;
    }[] | undefined;
    education?: {
        start_date: string;
        institution: string;
        degree: string;
        field_of_study: string;
        end_date?: string | undefined;
        grade?: string | undefined;
    }[] | undefined;
    emergency_contacts?: {
        name: string;
        relationship: string;
        phone: string;
        email?: string | undefined;
        is_primary?: boolean | undefined;
    }[] | undefined;
    tax_id?: unknown;
    tax_filing_status?: unknown;
    custom_fields?: Record<string, unknown> | undefined;
}>;
export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export declare const updateEmployeeSchema: z.ZodObject<{
    first_name: z.ZodOptional<z.ZodString>;
    middle_name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    last_name: z.ZodOptional<z.ZodString>;
    date_of_birth: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    gender: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    nationality: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    marital_status: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    profile_picture_url: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    work_email: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    personal_email: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    work_phone: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    personal_phone: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    address_line1: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    address_line2: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    city: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    state: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    postal_code: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    country: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    department_id: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    job_title: z.ZodOptional<z.ZodString>;
    job_level: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    employment_type: z.ZodOptional<z.ZodNativeEnum<typeof EmploymentType>>;
    employment_status: z.ZodOptional<z.ZodNativeEnum<typeof EmploymentStatus>>;
    probation_end_date: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    termination_date: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    termination_reason: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    manager_id: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    base_salary: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    salary_currency: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    salary_frequency: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    work_location: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    work_schedule: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    timezone: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    is_remote: z.ZodOptional<z.ZodBoolean>;
    skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        level: z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>;
        years_of_experience: z.ZodOptional<z.ZodNumber>;
        certified: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        level: "beginner" | "intermediate" | "advanced" | "expert";
        name: string;
        years_of_experience?: number | undefined;
        certified?: boolean | undefined;
    }, {
        level: "beginner" | "intermediate" | "advanced" | "expert";
        name: string;
        years_of_experience?: number | undefined;
        certified?: boolean | undefined;
    }>, "many">>;
    certifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        issuer: z.ZodString;
        issue_date: z.ZodString;
        expiry_date: z.ZodOptional<z.ZodString>;
        credential_id: z.ZodOptional<z.ZodString>;
        credential_url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string | undefined;
        credential_id?: string | undefined;
        credential_url?: string | undefined;
    }, {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string | undefined;
        credential_id?: string | undefined;
        credential_url?: string | undefined;
    }>, "many">>;
    education: z.ZodOptional<z.ZodArray<z.ZodObject<{
        institution: z.ZodString;
        degree: z.ZodString;
        field_of_study: z.ZodString;
        start_date: z.ZodString;
        end_date: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        start_date: string;
        institution: string;
        degree: string;
        field_of_study: string;
        end_date?: string | undefined;
        grade?: string | undefined;
    }, {
        start_date: string;
        institution: string;
        degree: string;
        field_of_study: string;
        end_date?: string | undefined;
        grade?: string | undefined;
    }>, "many">>;
    emergency_contacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        relationship: z.ZodString;
        phone: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        is_primary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        relationship: string;
        phone: string;
        is_primary: boolean;
        email?: string | undefined;
    }, {
        name: string;
        relationship: string;
        phone: string;
        email?: string | undefined;
        is_primary?: boolean | undefined;
    }>, "many">>;
    documents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        name: z.ZodString;
        url: z.ZodString;
        uploaded_at: z.ZodOptional<z.ZodString>;
        verified: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        name: string;
        url: string;
        uploaded_at?: string | undefined;
        verified?: boolean | undefined;
    }, {
        type: string;
        name: string;
        url: string;
        uploaded_at?: string | undefined;
        verified?: boolean | undefined;
    }>, "many">>;
    performance_goals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        description: z.ZodString;
        target_date: z.ZodString;
        status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "completed", "cancelled"]>>;
        progress_percentage: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: "not_started" | "in_progress" | "completed" | "cancelled";
        description: string;
        title: string;
        target_date: string;
        progress_percentage: number;
        id?: string | undefined;
    }, {
        description: string;
        title: string;
        target_date: string;
        status?: "not_started" | "in_progress" | "completed" | "cancelled" | undefined;
        id?: string | undefined;
        progress_percentage?: number | undefined;
    }>, "many">>;
    last_performance_rating: z.ZodOptional<z.ZodNumber>;
    last_review_date: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    next_review_date: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    leave_balances: z.ZodOptional<z.ZodArray<z.ZodObject<{
        leave_type: z.ZodString;
        total_days: z.ZodNumber;
        used_days: z.ZodNumber;
        pending_days: z.ZodNumber;
        carry_forward_days: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        leave_type: string;
        total_days: number;
        used_days: number;
        pending_days: number;
        carry_forward_days: number;
    }, {
        leave_type: string;
        total_days: number;
        used_days: number;
        pending_days: number;
        carry_forward_days: number;
    }>, "many">>;
    bank_details: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        bank_name: z.ZodString;
        account_number_masked: z.ZodString;
        routing_number_masked: z.ZodOptional<z.ZodString>;
        account_type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        bank_name: string;
        account_number_masked: string;
        account_type: string;
        routing_number_masked?: string | undefined;
    }, {
        bank_name: string;
        account_number_masked: string;
        account_type: string;
        routing_number_masked?: string | undefined;
    }>>>;
    tax_id: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    tax_filing_status: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | null | undefined, unknown>;
    custom_fields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    manager_id?: string | null | undefined;
    first_name?: string | undefined;
    middle_name?: string | null | undefined;
    last_name?: string | undefined;
    date_of_birth?: string | null | undefined;
    gender?: string | null | undefined;
    nationality?: string | null | undefined;
    marital_status?: string | null | undefined;
    profile_picture_url?: string | null | undefined;
    work_email?: string | undefined;
    personal_email?: string | null | undefined;
    work_phone?: string | null | undefined;
    personal_phone?: string | null | undefined;
    address_line1?: string | null | undefined;
    address_line2?: string | null | undefined;
    city?: string | null | undefined;
    state?: string | null | undefined;
    postal_code?: string | null | undefined;
    country?: string | null | undefined;
    department_id?: string | null | undefined;
    job_title?: string | undefined;
    job_level?: string | null | undefined;
    employment_type?: EmploymentType | undefined;
    employment_status?: EmploymentStatus | undefined;
    probation_end_date?: string | null | undefined;
    termination_date?: string | null | undefined;
    termination_reason?: string | null | undefined;
    base_salary?: number | null | undefined;
    salary_currency?: string | undefined;
    salary_frequency?: string | undefined;
    work_location?: string | null | undefined;
    work_schedule?: string | null | undefined;
    timezone?: string | null | undefined;
    is_remote?: boolean | undefined;
    skills?: {
        level: "beginner" | "intermediate" | "advanced" | "expert";
        name: string;
        years_of_experience?: number | undefined;
        certified?: boolean | undefined;
    }[] | undefined;
    certifications?: {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string | undefined;
        credential_id?: string | undefined;
        credential_url?: string | undefined;
    }[] | undefined;
    education?: {
        start_date: string;
        institution: string;
        degree: string;
        field_of_study: string;
        end_date?: string | undefined;
        grade?: string | undefined;
    }[] | undefined;
    emergency_contacts?: {
        name: string;
        relationship: string;
        phone: string;
        is_primary: boolean;
        email?: string | undefined;
    }[] | undefined;
    leave_balances?: {
        leave_type: string;
        total_days: number;
        used_days: number;
        pending_days: number;
        carry_forward_days: number;
    }[] | undefined;
    documents?: {
        type: string;
        name: string;
        url: string;
        uploaded_at?: string | undefined;
        verified?: boolean | undefined;
    }[] | undefined;
    performance_goals?: {
        status: "not_started" | "in_progress" | "completed" | "cancelled";
        description: string;
        title: string;
        target_date: string;
        progress_percentage: number;
        id?: string | undefined;
    }[] | undefined;
    last_performance_rating?: number | undefined;
    last_review_date?: string | null | undefined;
    next_review_date?: string | null | undefined;
    bank_details?: {
        bank_name: string;
        account_number_masked: string;
        account_type: string;
        routing_number_masked?: string | undefined;
    } | null | undefined;
    tax_id?: string | null | undefined;
    tax_filing_status?: string | null | undefined;
    custom_fields?: Record<string, unknown> | undefined;
}, {
    manager_id?: unknown;
    first_name?: string | undefined;
    middle_name?: unknown;
    last_name?: string | undefined;
    date_of_birth?: unknown;
    gender?: unknown;
    nationality?: unknown;
    marital_status?: unknown;
    profile_picture_url?: unknown;
    work_email?: unknown;
    personal_email?: unknown;
    work_phone?: unknown;
    personal_phone?: unknown;
    address_line1?: unknown;
    address_line2?: unknown;
    city?: unknown;
    state?: unknown;
    postal_code?: unknown;
    country?: unknown;
    department_id?: unknown;
    job_title?: string | undefined;
    job_level?: unknown;
    employment_type?: EmploymentType | undefined;
    employment_status?: EmploymentStatus | undefined;
    probation_end_date?: unknown;
    termination_date?: unknown;
    termination_reason?: unknown;
    base_salary?: number | null | undefined;
    salary_currency?: unknown;
    salary_frequency?: unknown;
    work_location?: unknown;
    work_schedule?: unknown;
    timezone?: unknown;
    is_remote?: boolean | undefined;
    skills?: {
        level: "beginner" | "intermediate" | "advanced" | "expert";
        name: string;
        years_of_experience?: number | undefined;
        certified?: boolean | undefined;
    }[] | undefined;
    certifications?: {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string | undefined;
        credential_id?: string | undefined;
        credential_url?: string | undefined;
    }[] | undefined;
    education?: {
        start_date: string;
        institution: string;
        degree: string;
        field_of_study: string;
        end_date?: string | undefined;
        grade?: string | undefined;
    }[] | undefined;
    emergency_contacts?: {
        name: string;
        relationship: string;
        phone: string;
        email?: string | undefined;
        is_primary?: boolean | undefined;
    }[] | undefined;
    leave_balances?: {
        leave_type: string;
        total_days: number;
        used_days: number;
        pending_days: number;
        carry_forward_days: number;
    }[] | undefined;
    documents?: {
        type: string;
        name: string;
        url: string;
        uploaded_at?: string | undefined;
        verified?: boolean | undefined;
    }[] | undefined;
    performance_goals?: {
        description: string;
        title: string;
        target_date: string;
        status?: "not_started" | "in_progress" | "completed" | "cancelled" | undefined;
        id?: string | undefined;
        progress_percentage?: number | undefined;
    }[] | undefined;
    last_performance_rating?: number | undefined;
    last_review_date?: unknown;
    next_review_date?: unknown;
    bank_details?: {
        bank_name: string;
        account_number_masked: string;
        account_type: string;
        routing_number_masked?: string | undefined;
    } | null | undefined;
    tax_id?: unknown;
    tax_filing_status?: unknown;
    custom_fields?: Record<string, unknown> | undefined;
}>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
export declare const listEmployeesQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    department_id: z.ZodOptional<z.ZodString>;
    manager_id: z.ZodOptional<z.ZodString>;
    employment_status: z.ZodOptional<z.ZodNativeEnum<typeof EmploymentStatus>>;
    employment_type: z.ZodOptional<z.ZodNativeEnum<typeof EmploymentType>>;
    job_title: z.ZodOptional<z.ZodString>;
    job_level: z.ZodOptional<z.ZodString>;
    work_location: z.ZodOptional<z.ZodString>;
    is_remote: z.ZodOptional<z.ZodBoolean>;
    hire_date_from: z.ZodOptional<z.ZodString>;
    hire_date_to: z.ZodOptional<z.ZodString>;
    sort_by: z.ZodDefault<z.ZodEnum<["first_name", "last_name", "hire_date", "job_title", "department", "created_at"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort_by: "created_at" | "first_name" | "last_name" | "department" | "job_title" | "hire_date";
    sort_order: "asc" | "desc";
    search?: string | undefined;
    manager_id?: string | undefined;
    department_id?: string | undefined;
    job_title?: string | undefined;
    job_level?: string | undefined;
    employment_type?: EmploymentType | undefined;
    employment_status?: EmploymentStatus | undefined;
    work_location?: string | undefined;
    is_remote?: boolean | undefined;
    hire_date_from?: string | undefined;
    hire_date_to?: string | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    manager_id?: string | undefined;
    department_id?: string | undefined;
    job_title?: string | undefined;
    job_level?: string | undefined;
    employment_type?: EmploymentType | undefined;
    employment_status?: EmploymentStatus | undefined;
    work_location?: string | undefined;
    is_remote?: boolean | undefined;
    page?: number | undefined;
    hire_date_from?: string | undefined;
    hire_date_to?: string | undefined;
    sort_by?: "created_at" | "first_name" | "last_name" | "department" | "job_title" | "hire_date" | undefined;
    sort_order?: "asc" | "desc" | undefined;
}>;
export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;
export declare const bulkUpdateEmployeesSchema: z.ZodObject<{
    employee_ids: z.ZodArray<z.ZodString, "many">;
    updates: z.ZodObject<{
        department_id: z.ZodOptional<z.ZodString>;
        manager_id: z.ZodOptional<z.ZodString>;
        employment_status: z.ZodOptional<z.ZodNativeEnum<typeof EmploymentStatus>>;
        work_location: z.ZodOptional<z.ZodString>;
        is_remote: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        manager_id?: string | undefined;
        department_id?: string | undefined;
        employment_status?: EmploymentStatus | undefined;
        work_location?: string | undefined;
        is_remote?: boolean | undefined;
    }, {
        manager_id?: string | undefined;
        department_id?: string | undefined;
        employment_status?: EmploymentStatus | undefined;
        work_location?: string | undefined;
        is_remote?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    employee_ids: string[];
    updates: {
        manager_id?: string | undefined;
        department_id?: string | undefined;
        employment_status?: EmploymentStatus | undefined;
        work_location?: string | undefined;
        is_remote?: boolean | undefined;
    };
}, {
    employee_ids: string[];
    updates: {
        manager_id?: string | undefined;
        department_id?: string | undefined;
        employment_status?: EmploymentStatus | undefined;
        work_location?: string | undefined;
        is_remote?: boolean | undefined;
    };
}>;
export type BulkUpdateEmployeesDto = z.infer<typeof bulkUpdateEmployeesSchema>;
export declare const addSkillSchema: z.ZodObject<{
    name: z.ZodString;
    level: z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>;
    years_of_experience: z.ZodOptional<z.ZodNumber>;
    certified: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    level: "beginner" | "intermediate" | "advanced" | "expert";
    name: string;
    years_of_experience?: number | undefined;
    certified?: boolean | undefined;
}, {
    level: "beginner" | "intermediate" | "advanced" | "expert";
    name: string;
    years_of_experience?: number | undefined;
    certified?: boolean | undefined;
}>;
export type AddSkillDto = z.infer<typeof addSkillSchema>;
export declare const addCertificationSchema: z.ZodObject<{
    name: z.ZodString;
    issuer: z.ZodString;
    issue_date: z.ZodString;
    expiry_date: z.ZodOptional<z.ZodString>;
    credential_id: z.ZodOptional<z.ZodString>;
    credential_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string | undefined;
    credential_id?: string | undefined;
    credential_url?: string | undefined;
}, {
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string | undefined;
    credential_id?: string | undefined;
    credential_url?: string | undefined;
}>;
export type AddCertificationDto = z.infer<typeof addCertificationSchema>;
export declare const addEducationSchema: z.ZodObject<{
    institution: z.ZodString;
    degree: z.ZodString;
    field_of_study: z.ZodString;
    start_date: z.ZodString;
    end_date: z.ZodOptional<z.ZodString>;
    grade: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    start_date: string;
    institution: string;
    degree: string;
    field_of_study: string;
    end_date?: string | undefined;
    grade?: string | undefined;
}, {
    start_date: string;
    institution: string;
    degree: string;
    field_of_study: string;
    end_date?: string | undefined;
    grade?: string | undefined;
}>;
export type AddEducationDto = z.infer<typeof addEducationSchema>;
export declare const addPerformanceGoalSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodString;
    target_date: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["not_started", "in_progress", "completed", "cancelled"]>>;
    progress_percentage: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "not_started" | "in_progress" | "completed" | "cancelled";
    description: string;
    title: string;
    target_date: string;
    progress_percentage: number;
    id?: string | undefined;
}, {
    description: string;
    title: string;
    target_date: string;
    status?: "not_started" | "in_progress" | "completed" | "cancelled" | undefined;
    id?: string | undefined;
    progress_percentage?: number | undefined;
}>;
export type AddPerformanceGoalDto = z.infer<typeof addPerformanceGoalSchema>;
export declare const updatePerformanceGoalSchema: z.ZodObject<{
    goal_id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    target_date: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["not_started", "in_progress", "completed", "cancelled"]>>;
    progress_percentage: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    goal_id: string;
    status?: "not_started" | "in_progress" | "completed" | "cancelled" | undefined;
    description?: string | undefined;
    title?: string | undefined;
    target_date?: string | undefined;
    progress_percentage?: number | undefined;
}, {
    goal_id: string;
    status?: "not_started" | "in_progress" | "completed" | "cancelled" | undefined;
    description?: string | undefined;
    title?: string | undefined;
    target_date?: string | undefined;
    progress_percentage?: number | undefined;
}>;
export type UpdatePerformanceGoalDto = z.infer<typeof updatePerformanceGoalSchema>;
export declare const addDocumentSchema: z.ZodObject<{
    type: z.ZodString;
    name: z.ZodString;
    url: z.ZodString;
    uploaded_at: z.ZodOptional<z.ZodString>;
    verified: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: string;
    name: string;
    url: string;
    uploaded_at?: string | undefined;
    verified?: boolean | undefined;
}, {
    type: string;
    name: string;
    url: string;
    uploaded_at?: string | undefined;
    verified?: boolean | undefined;
}>;
export type AddDocumentDto = z.infer<typeof addDocumentSchema>;
export declare const updateLeaveBalanceSchema: z.ZodObject<{
    leave_type: z.ZodString;
    total_days: z.ZodOptional<z.ZodNumber>;
    used_days: z.ZodOptional<z.ZodNumber>;
    pending_days: z.ZodOptional<z.ZodNumber>;
    carry_forward_days: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    leave_type: string;
    total_days?: number | undefined;
    used_days?: number | undefined;
    pending_days?: number | undefined;
    carry_forward_days?: number | undefined;
}, {
    leave_type: string;
    total_days?: number | undefined;
    used_days?: number | undefined;
    pending_days?: number | undefined;
    carry_forward_days?: number | undefined;
}>;
export type UpdateLeaveBalanceDto = z.infer<typeof updateLeaveBalanceSchema>;
export declare const transferEmployeeSchema: z.ZodObject<{
    new_department_id: z.ZodString;
    new_job_title: z.ZodOptional<z.ZodString>;
    new_job_level: z.ZodOptional<z.ZodString>;
    new_manager_id: z.ZodOptional<z.ZodString>;
    new_salary: z.ZodOptional<z.ZodNumber>;
    effective_date: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    new_department_id: string;
    effective_date: string;
    reason?: string | undefined;
    new_job_title?: string | undefined;
    new_job_level?: string | undefined;
    new_manager_id?: string | undefined;
    new_salary?: number | undefined;
}, {
    new_department_id: string;
    effective_date: string;
    reason?: string | undefined;
    new_job_title?: string | undefined;
    new_job_level?: string | undefined;
    new_manager_id?: string | undefined;
    new_salary?: number | undefined;
}>;
export type TransferEmployeeDto = z.infer<typeof transferEmployeeSchema>;
export declare const promoteEmployeeSchema: z.ZodObject<{
    new_job_title: z.ZodString;
    new_job_level: z.ZodOptional<z.ZodString>;
    new_salary: z.ZodOptional<z.ZodNumber>;
    effective_date: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    new_job_title: string;
    effective_date: string;
    reason?: string | undefined;
    new_job_level?: string | undefined;
    new_salary?: number | undefined;
}, {
    new_job_title: string;
    effective_date: string;
    reason?: string | undefined;
    new_job_level?: string | undefined;
    new_salary?: number | undefined;
}>;
export type PromoteEmployeeDto = z.infer<typeof promoteEmployeeSchema>;
export declare const terminateEmployeeSchema: z.ZodObject<{
    termination_date: z.ZodString;
    termination_reason: z.ZodString;
    last_working_date: z.ZodOptional<z.ZodString>;
    eligible_for_rehire: z.ZodDefault<z.ZodBoolean>;
    exit_interview_completed: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    termination_date: string;
    termination_reason: string;
    eligible_for_rehire: boolean;
    exit_interview_completed: boolean;
    last_working_date?: string | undefined;
    notes?: string | undefined;
}, {
    termination_date: string;
    termination_reason: string;
    last_working_date?: string | undefined;
    eligible_for_rehire?: boolean | undefined;
    exit_interview_completed?: boolean | undefined;
    notes?: string | undefined;
}>;
export type TerminateEmployeeDto = z.infer<typeof terminateEmployeeSchema>;
export declare const onboardEmployeeSchema: z.ZodObject<{
    employee_id: z.ZodString;
    onboarding_tasks: z.ZodArray<z.ZodObject<{
        task: z.ZodString;
        completed: z.ZodDefault<z.ZodBoolean>;
        completed_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        completed: boolean;
        task: string;
        completed_at?: string | undefined;
    }, {
        task: string;
        completed?: boolean | undefined;
        completed_at?: string | undefined;
    }>, "many">;
    equipment_assigned: z.ZodOptional<z.ZodArray<z.ZodObject<{
        item: z.ZodString;
        serial_number: z.ZodOptional<z.ZodString>;
        assigned_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        item: string;
        assigned_at: string;
        serial_number?: string | undefined;
    }, {
        item: string;
        assigned_at: string;
        serial_number?: string | undefined;
    }>, "many">>;
    access_granted: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    buddy_assigned: z.ZodOptional<z.ZodString>;
    orientation_date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    employee_id: string;
    onboarding_tasks: {
        completed: boolean;
        task: string;
        completed_at?: string | undefined;
    }[];
    equipment_assigned?: {
        item: string;
        assigned_at: string;
        serial_number?: string | undefined;
    }[] | undefined;
    access_granted?: string[] | undefined;
    buddy_assigned?: string | undefined;
    orientation_date?: string | undefined;
}, {
    employee_id: string;
    onboarding_tasks: {
        task: string;
        completed?: boolean | undefined;
        completed_at?: string | undefined;
    }[];
    equipment_assigned?: {
        item: string;
        assigned_at: string;
        serial_number?: string | undefined;
    }[] | undefined;
    access_granted?: string[] | undefined;
    buddy_assigned?: string | undefined;
    orientation_date?: string | undefined;
}>;
export type OnboardEmployeeDto = z.infer<typeof onboardEmployeeSchema>;
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
//# sourceMappingURL=employee.dto.d.ts.map