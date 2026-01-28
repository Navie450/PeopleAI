import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveZitadelAddPassword1737540000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add password_hash column
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "password_hash" varchar(255);
    `);

    // Make zitadel_user_id nullable first (in case there are existing users)
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "zitadel_user_id" DROP NOT NULL;
    `);

    // Drop unique constraint and index on zitadel_user_id
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_zitadel_user_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP CONSTRAINT IF EXISTS "UQ_zitadel_user_id";
    `);

    // Drop zitadel_user_id column
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "zitadel_user_id";
    `);

    // Set password_hash as NOT NULL after data migration if needed
    // For now, keep it nullable to allow migration of existing data
    // You can run UPDATE to set default passwords for existing users if any
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back zitadel_user_id column
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "zitadel_user_id" varchar(255);
    `);

    // Add back unique constraint
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "UQ_zitadel_user_id" UNIQUE ("zitadel_user_id");
    `);

    // Add back index
    await queryRunner.query(`
      CREATE INDEX "IDX_zitadel_user_id" ON "users" ("zitadel_user_id");
    `);

    // Drop password_hash column
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "password_hash";
    `);
  }
}
