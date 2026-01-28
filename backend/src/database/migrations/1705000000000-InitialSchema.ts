import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1705000000000 implements MigrationInterface {
  name = 'InitialSchema1705000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(50) NOT NULL,
        "zitadel_role_id" character varying(255),
        "description" text,
        "permissions" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name")
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "zitadel_user_id" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "username" character varying(100),
        "first_name" character varying(100),
        "last_name" character varying(100),
        "display_name" character varying(200),
        "phone" character varying(50),
        "is_active" boolean NOT NULL DEFAULT true,
        "email_verified" boolean NOT NULL DEFAULT false,
        "metadata" jsonb,
        "last_login_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_zitadel_user_id" UNIQUE ("zitadel_user_id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username")
      )
    `);

    // Create user_roles table
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        "assigned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "assigned_by" uuid,
        CONSTRAINT "PK_user_roles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_roles_user_role" UNIQUE ("user_id", "role_id"),
        CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
      )
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid,
        "action" character varying(100) NOT NULL,
        "resource_type" character varying(50) NOT NULL,
        "resource_id" uuid,
        "changes" jsonb,
        "ip_address" character varying(45),
        "user_agent" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_audit_logs_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Create token_cache table
    await queryRunner.query(`
      CREATE TABLE "token_cache" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "token_jti" character varying(255) NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revoked" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_token_cache" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_token_cache_token_jti" UNIQUE ("token_jti"),
        CONSTRAINT "FK_token_cache_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_users_zitadel_user_id" ON "users" ("zitadel_user_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_is_active" ON "users" ("is_active") WHERE "deleted_at" IS NULL`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_roles_user_id" ON "user_roles" ("user_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_roles_role_id" ON "user_roles" ("role_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_user_id" ON "audit_logs" ("user_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_created_at" ON "audit_logs" ("created_at")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_token_cache_user_id" ON "token_cache" ("user_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_token_cache_expires_at" ON "token_cache" ("expires_at")`
    );

    // Create trigger for updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_roles_updated_at
      BEFORE UPDATE ON roles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);

    // Insert initial roles
    await queryRunner.query(`
      INSERT INTO "roles" ("name", "description") VALUES
      ('admin', 'Administrator with full access to all features'),
      ('manager', 'Manager with limited administrative access'),
      ('user', 'Standard user with basic access')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_roles_updated_at ON roles`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON users`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "token_cache"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);

    // Drop extension
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
