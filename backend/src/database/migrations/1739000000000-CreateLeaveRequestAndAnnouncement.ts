import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLeaveRequestAndAnnouncement1739000000000 implements MigrationInterface {
  name = 'CreateLeaveRequestAndAnnouncement1739000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create leave_request_status enum
    await queryRunner.query(`
      CREATE TYPE "leave_request_status_enum" AS ENUM (
        'pending',
        'approved',
        'rejected',
        'cancelled'
      )
    `);

    // Create leave_type enum
    await queryRunner.query(`
      CREATE TYPE "leave_type_enum" AS ENUM (
        'annual',
        'sick',
        'personal',
        'maternity',
        'paternity',
        'bereavement',
        'unpaid',
        'compensatory',
        'other'
      )
    `);

    // Create announcement_type enum
    await queryRunner.query(`
      CREATE TYPE "announcement_type_enum" AS ENUM (
        'general',
        'hr_update',
        'policy',
        'event',
        'celebration',
        'urgent'
      )
    `);

    // Create announcement_priority enum
    await queryRunner.query(`
      CREATE TYPE "announcement_priority_enum" AS ENUM (
        'low',
        'normal',
        'high',
        'critical'
      )
    `);

    // Create leave_requests table
    await queryRunner.query(`
      CREATE TABLE "leave_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "employee_id" uuid NOT NULL,
        "leave_type" leave_type_enum NOT NULL DEFAULT 'annual',
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "total_days" decimal(5,2) NOT NULL,
        "reason" text,
        "status" leave_request_status_enum NOT NULL DEFAULT 'pending',
        "reviewed_by" uuid,
        "reviewed_at" TIMESTAMP WITH TIME ZONE,
        "reviewer_comments" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_leave_requests" PRIMARY KEY ("id"),
        CONSTRAINT "FK_leave_requests_employee" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_leave_requests_reviewer" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Create announcements table
    await queryRunner.query(`
      CREATE TABLE "announcements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(200) NOT NULL,
        "content" text NOT NULL,
        "type" announcement_type_enum NOT NULL DEFAULT 'general',
        "priority" announcement_priority_enum NOT NULL DEFAULT 'normal',
        "created_by" uuid NOT NULL,
        "publish_date" TIMESTAMP WITH TIME ZONE,
        "expiry_date" TIMESTAMP WITH TIME ZONE,
        "is_active" boolean NOT NULL DEFAULT true,
        "is_pinned" boolean NOT NULL DEFAULT false,
        "target_departments" uuid[],
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_announcements" PRIMARY KEY ("id"),
        CONSTRAINT "FK_announcements_author" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes for leave_requests
    await queryRunner.query(
      `CREATE INDEX "IDX_leave_requests_employee_id" ON "leave_requests" ("employee_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_leave_requests_leave_type" ON "leave_requests" ("leave_type")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_leave_requests_status" ON "leave_requests" ("status")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_leave_requests_start_date" ON "leave_requests" ("start_date")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_leave_requests_reviewed_by" ON "leave_requests" ("reviewed_by")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_leave_requests_pending" ON "leave_requests" ("status") WHERE "status" = 'pending' AND "deleted_at" IS NULL`
    );

    // Create indexes for announcements
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_type" ON "announcements" ("type")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_priority" ON "announcements" ("priority")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_created_by" ON "announcements" ("created_by")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_is_active" ON "announcements" ("is_active") WHERE "deleted_at" IS NULL`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_is_pinned" ON "announcements" ("is_pinned") WHERE "is_pinned" = true AND "deleted_at" IS NULL`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_publish_date" ON "announcements" ("publish_date")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_expiry_date" ON "announcements" ("expiry_date")`
    );

    // Create GIN index for target_departments array
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_target_departments_gin" ON "announcements" USING GIN ("target_departments")`
    );

    // Create triggers for updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_leave_requests_updated_at
      BEFORE UPDATE ON leave_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_announcements_updated_at
      BEFORE UPDATE ON announcements
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_leave_requests_updated_at ON leave_requests`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "announcements"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "leave_requests"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "announcement_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "announcement_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "leave_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "leave_request_status_enum"`);
  }
}
