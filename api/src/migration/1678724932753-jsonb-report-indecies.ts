import { QueryRunner } from 'typeorm'

export class jsonbReportIndecies1678724932753 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
        CREATE EXTENSION pg_trgm;

        CREATE INDEX idx_report_d_title ON report USING gin ((d ->> 'title') gin_trgm_ops);

        CREATE INDEX report_d_substances_name_idx ON report
            USING gin ((d->'substances'->'name'));
    `)
  }
}
