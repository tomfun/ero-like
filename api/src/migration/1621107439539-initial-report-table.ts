import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialReportTable1621107439539 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
create table report
(
    id             uuid    not null
        constraint report_pk
            primary key,
    title          varchar not null,
    nick           varchar not null,
    "gpgSignature" varchar not null
);
                                 `);
  }

  public async down(): Promise<void> {
    // pashёl nahuy
  }
}
