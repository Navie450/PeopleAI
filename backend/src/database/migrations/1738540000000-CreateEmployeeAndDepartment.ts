import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeAndDepartment1738540000000 implements MigrationInterface {
  name = 'CreateEmployeeAndDepartment1738540000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create employment_status enum
    await queryRunner.query(`
      CREATE TYPE "employment_status_enum" AS ENUM (
        'active',
        'on_leave',
        'probation',
        'notice_period',
        'terminated',
        'resigned',
        'retired'
      )
    `);

    // Create employment_type enum
    await queryRunner.query(`
      CREATE TYPE "employment_type_enum" AS ENUM (
        'full_time',
        'part_time',
        'contract',
        'intern',
        'freelance',
        'temporary'
      )
    `);

    // Create departments table
    await queryRunner.query(`
      CREATE TABLE "departments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "code" character varying(20) NOT NULL,
        "description" text,
        "parent_id" uuid,
        "manager_id" uuid,
        "location" character varying(100),
        "budget" decimal(15,2),
        "metadata" jsonb,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_departments" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_departments_name" UNIQUE ("name"),
        CONSTRAINT "UQ_departments_code" UNIQUE ("code"),
        CONSTRAINT "FK_departments_parent" FOREIGN KEY ("parent_id") REFERENCES "departments"("id") ON DELETE SET NULL
      )
    `);

    // Create employees table
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "employee_id" character varying(20) NOT NULL,
        "user_id" uuid NOT NULL,

        -- Personal Information
        "first_name" character varying(100) NOT NULL,
        "middle_name" character varying(100),
        "last_name" character varying(100) NOT NULL,
        "date_of_birth" date,
        "gender" character varying(20),
        "nationality" character varying(100),
        "marital_status" character varying(50),
        "profile_picture_url" character varying(255),

        -- Contact Information
        "work_email" character varying(255) NOT NULL,
        "personal_email" character varying(255),
        "work_phone" character varying(50),
        "personal_phone" character varying(50),

        -- Address
        "address_line1" text,
        "address_line2" text,
        "city" character varying(100),
        "state" character varying(100),
        "postal_code" character varying(20),
        "country" character varying(100),

        -- Employment Details
        "department_id" uuid,
        "job_title" character varying(100) NOT NULL,
        "job_level" character varying(100),
        "employment_type" employment_type_enum NOT NULL DEFAULT 'full_time',
        "employment_status" employment_status_enum NOT NULL DEFAULT 'active',
        "hire_date" date NOT NULL,
        "probation_end_date" date,
        "termination_date" date,
        "termination_reason" text,

        -- Reporting Structure
        "manager_id" uuid,

        -- Compensation
        "base_salary" decimal(15,2),
        "salary_currency" character varying(10) NOT NULL DEFAULT 'USD',
        "salary_frequency" character varying(20) NOT NULL DEFAULT 'annual',

        -- Work Details
        "work_location" character varying(100),
        "work_schedule" character varying(50),
        "timezone" character varying(50),
        "is_remote" boolean NOT NULL DEFAULT false,

        -- Skills & Competencies (JSONB)
        "skills" jsonb,
        "certifications" jsonb,
        "education" jsonb,

        -- Emergency Contact (JSONB)
        "emergency_contacts" jsonb,

        -- Leave Balances (JSONB)
        "leave_balances" jsonb,

        -- Documents (JSONB)
        "documents" jsonb,

        -- Performance (JSONB)
        "performance_goals" jsonb,
        "last_performance_rating" decimal(3,2),
        "last_review_date" date,
        "next_review_date" date,

        -- Employment History (JSONB)
        "employment_history" jsonb,

        -- Bank Details (JSONB - would be encrypted in production)
        "bank_details" jsonb,

        -- Tax Information
        "tax_id" character varying(50),
        "tax_filing_status" character varying(50),

        -- Custom Fields
        "custom_fields" jsonb,

        -- Metadata
        "metadata" jsonb,

        -- Timestamps
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        CONSTRAINT "PK_employees" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_employees_employee_id" UNIQUE ("employee_id"),
        CONSTRAINT "UQ_employees_user_id" UNIQUE ("user_id"),
        CONSTRAINT "UQ_employees_work_email" UNIQUE ("work_email"),
        CONSTRAINT "FK_employees_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_employees_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_employees_manager" FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE SET NULL
      )
    `);

    // Add manager foreign key to departments (after employees table is created)
    await queryRunner.query(`
      ALTER TABLE "departments"
      ADD CONSTRAINT "FK_departments_manager"
      FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE SET NULL
    `);

    // Create indexes for departments
    await queryRunner.query(
      `CREATE INDEX "IDX_departments_name" ON "departments" ("name")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_departments_parent_id" ON "departments" ("parent_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_departments_manager_id" ON "departments" ("manager_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_departments_is_active" ON "departments" ("is_active") WHERE "deleted_at" IS NULL`
    );

    // Create indexes for employees
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_employee_id" ON "employees" ("employee_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_user_id" ON "employees" ("user_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_work_email" ON "employees" ("work_email")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_department_id" ON "employees" ("department_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_manager_id" ON "employees" ("manager_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_job_title" ON "employees" ("job_title")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_employment_status" ON "employees" ("employment_status")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_employment_type" ON "employees" ("employment_type")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_hire_date" ON "employees" ("hire_date")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_is_active" ON "employees" ("employment_status") WHERE "deleted_at" IS NULL`
    );

    // Create GIN indexes for JSONB search
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_skills_gin" ON "employees" USING GIN ("skills")`
    );

    // Create triggers for updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_departments_updated_at
      BEFORE UPDATE ON departments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_employees_updated_at
      BEFORE UPDATE ON employees
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);

    // Insert sample departments
    await queryRunner.query(`
      INSERT INTO "departments" ("name", "code", "description", "location") VALUES
      ('Engineering', 'ENG', 'Software development and engineering team', 'San Francisco'),
      ('Human Resources', 'HR', 'Human resources and people operations', 'San Francisco'),
      ('Finance', 'FIN', 'Finance and accounting department', 'New York'),
      ('Marketing', 'MKT', 'Marketing and communications team', 'San Francisco'),
      ('Sales', 'SLS', 'Sales and business development', 'New York'),
      ('Operations', 'OPS', 'Operations and logistics', 'Chicago'),
      ('Product', 'PRD', 'Product management and design', 'San Francisco'),
      ('Customer Success', 'CS', 'Customer success and support', 'Remote')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_employees_updated_at ON employees`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_departments_updated_at ON departments`);

    // Drop foreign key from departments first
    await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT IF EXISTS "FK_departments_manager"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "employees"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "departments"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "employment_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "employment_status_enum"`);
  }
}
