import { QueryRunner } from 'typeorm';

export class initialReportTable1621107439539 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
CREATE TABLE report
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
}
