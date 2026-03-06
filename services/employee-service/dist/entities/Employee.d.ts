import { Department } from './Department';
export declare enum EmploymentStatus {
    ACTIVE = "active",
    ON_LEAVE = "on_leave",
    PROBATION = "probation",
    NOTICE_PERIOD = "notice_period",
    TERMINATED = "terminated",
    RESIGNED = "resigned",
    RETIRED = "retired"
}
export declare enum EmploymentType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    INTERN = "intern",
    FREELANCE = "freelance",
    TEMPORARY = "temporary"
}
export declare class Employee {
    id: string;
    employee_id: string;
    user_id: string | null;
    first_name: string;
    middle_name?: string;
    last_name: string;
    date_of_birth?: Date;
    gender?: string;
    nationality?: string;
    marital_status?: string;
    profile_picture_url?: string;
    work_email: string;
    personal_email?: string;
    work_phone?: string;
    personal_phone?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    department_id?: string;
    department?: Department;
    job_title: string;
    job_level?: string;
    employment_type: EmploymentType;
    employment_status: EmploymentStatus;
    hire_date: Date;
    probation_end_date?: Date;
    termination_date?: Date;
    termination_reason?: string;
    manager_id?: string;
    manager?: Employee;
    direct_reports?: Employee[];
    base_salary?: number;
    salary_currency: string;
    salary_frequency: string;
    work_location?: string;
    work_schedule?: string;
    timezone?: string;
    is_remote: boolean;
    skills?: {
        name: string;
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        years_of_experience?: number;
        certified?: boolean;
    }[];
    certifications?: {
        name: string;
        issuer: string;
        issue_date: string;
        expiry_date?: string;
        credential_id?: string;
        credential_url?: string;
    }[];
    education?: {
        institution: string;
        degree: string;
        field_of_study: string;
        start_date: string;
        end_date?: string;
        grade?: string;
    }[];
    emergency_contacts?: {
        name: string;
        relationship: string;
        phone: string;
        email?: string;
        is_primary: boolean;
    }[];
    leave_balances?: {
        leave_type: string;
        total_days: number;
        used_days: number;
        pending_days: number;
        carry_forward_days: number;
    }[];
    documents?: {
        type: string;
        name: string;
        url: string;
        uploaded_at: string;
        verified?: boolean;
    }[];
    performance_goals?: {
        id: string;
        title: string;
        description: string;
        target_date: string;
        status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
        progress_percentage: number;
        created_at: string;
        updated_at: string;
    }[];
    last_performance_rating?: number;
    last_review_date?: Date;
    next_review_date?: Date;
    employment_history?: {
        job_title: string;
        department: string;
        start_date: string;
        end_date?: string;
        reason_for_change?: string;
    }[];
    bank_details?: {
        bank_name: string;
        account_number_masked: string;
        routing_number_masked?: string;
        account_type: string;
    };
    tax_id?: string;
    tax_filing_status?: string;
    custom_fields?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    get full_name(): string;
    get years_of_service(): number;
}
//# sourceMappingURL=Employee.d.ts.map