import { QueryRunner } from 'typeorm';

export class jsonbReportStructure1678724932752 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
        ALTER TABLE report
            DROP COLUMN title;

        ALTER TABLE report
            ADD "userId" uuid not null;

        ALTER TABLE report
            DROP COLUMN nick;

        ALTER TABLE report
            ADD "signatureId" uuid not null;

        ALTER TABLE report
            ADD "createdAt" timestamp not null;

        ALTER TABLE report
            DROP COLUMN "gpgSignature";

        ALTER TABLE report
            ADD d jsonb not null;

        ALTER TABLE report
            ADD type varchar(256) not null;

        ALTER TABLE report
            ADD constraint report_signature_fk
                foreign key ("signatureId") references signature;

        ALTER TABLE report
            ADD constraint report_user_fk
                foreign key ("userId") references "user";
    `);
  }
}
