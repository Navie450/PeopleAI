import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';
import { Department } from './Department';

// Employment status enum
export enum EmploymentStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  PROBATION = 'probation',
  NOTICE_PERIOD = 'notice_period',
  TERMINATED = 'terminated',
  RESIGNED = 'resigned',
  RETIRED = 'retired',
}

// Employment type enum
export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
  FREELANCE = 'freelance',
  TEMPORARY = 'temporary',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index()
  employee_id!: string; // e.g., EMP001

  @Column({ type: 'uuid', unique: true })
  @Index()
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  // Personal Information
  @Column({ type: 'varchar', length: 100 })
  first_name!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middle_name?: string;

  @Column({ type: 'varchar', length: 100 })
  last_name!: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  marital_status?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_picture_url?: string;

  // Contact Information
  @Column({ type: 'varchar', length: 255 })
  @Index()
  work_email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  personal_email?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  work_phone?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  personal_phone?: string;

  // Address
  @Column({ type: 'text', nullable: true })
  address_line1?: string;

  @Column({ type: 'text', nullable: true })
  address_line2?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postal_code?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  // Employment Details
  @Column({ type: 'uuid', nullable: true })
  @Index()
  department_id?: string;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  job_title!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  job_level?: string; // e.g., Junior, Mid, Senior, Lead, Manager

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  @Index()
  employment_type!: EmploymentType;

  @Column({
    type: 'enum',
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE,
  })
  @Index()
  employment_status!: EmploymentStatus;

  @Column({ type: 'date' })
  @Index()
  hire_date!: Date;

  @Column({ type: 'date', nullable: true })
  probation_end_date?: Date;

  @Column({ type: 'date', nullable: true })
  termination_date?: Date;

  @Column({ type: 'text', nullable: true })
  termination_reason?: string;

  // Reporting Structure
  @Column({ type: 'uuid', nullable: true })
  @Index()
  manager_id?: string;

  @ManyToOne(() => Employee, (employee) => employee.direct_reports, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager?: Employee;

  @OneToMany(() => Employee, (employee) => employee.manager)
  direct_reports?: Employee[];

  // Compensation
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  base_salary?: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  salary_currency!: string;

  @Column({ type: 'varchar', length: 20, default: 'annual' })
  salary_frequency!: string; // annual, monthly, hourly

  // Work Details
  @Column({ type: 'varchar', length: 100, nullable: true })
  work_location?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  work_schedule?: string; // e.g., 9-5, Flexible, Shift

  @Column({ type: 'varchar', length: 50, nullable: true })
  timezone?: string;

  @Column({ type: 'boolean', default: false })
  is_remote!: boolean;

  // Skills & Competencies
  @Column({ type: 'jsonb', nullable: true })
  skills?: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    years_of_experience?: number;
    certified?: boolean;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  certifications?: {
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
    credential_url?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  education?: {
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
    grade?: string;
  }[];

  // Emergency Contact
  @Column({ type: 'jsonb', nullable: true })
  emergency_contacts?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    is_primary: boolean;
  }[];

  // Leave Balances
  @Column({ type: 'jsonb', nullable: true })
  leave_balances?: {
    leave_type: string;
    total_days: number;
    used_days: number;
    pending_days: number;
    carry_forward_days: number;
  }[];

  // Documents
  @Column({ type: 'jsonb', nullable: true })
  documents?: {
    type: string; // resume, id_proof, offer_letter, etc.
    name: string;
    url: string;
    uploaded_at: string;
    verified?: boolean;
  }[];

  // Performance
  @Column({ type: 'jsonb', nullable: true })
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

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  last_performance_rating?: number; // e.g., 4.5 out of 5

  @Column({ type: 'date', nullable: true })
  last_review_date?: Date;

  @Column({ type: 'date', nullable: true })
  next_review_date?: Date;

  // Employment History (within company)
  @Column({ type: 'jsonb', nullable: true })
  employment_history?: {
    job_title: string;
    department: string;
    start_date: string;
    end_date?: string;
    reason_for_change?: string;
  }[];

  // Bank Details (encrypted in real scenario)
  @Column({ type: 'jsonb', nullable: true })
  bank_details?: {
    bank_name: string;
    account_number_masked: string; // Last 4 digits only
    routing_number_masked?: string;
    account_type: string;
  };

  // Tax Information
  @Column({ type: 'varchar', length: 50, nullable: true })
  tax_id?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tax_filing_status?: string;

  // Custom Fields
  @Column({ type: 'jsonb', nullable: true })
  custom_fields?: Record<string, unknown>;

  // Metadata
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at?: Date;

  // Virtual fields
  get full_name(): string {
    return [this.first_name, this.middle_name, this.last_name]
      .filter(Boolean)
      .join(' ');
  }

  get years_of_service(): number {
    const start = new Date(this.hire_date);
    const end = this.termination_date ? new Date(this.termination_date) : new Date();
    return Math.floor((end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }
}
