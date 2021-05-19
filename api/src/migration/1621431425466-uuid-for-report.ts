import { MigrationInterface, QueryRunner } from 'typeorm';

export class uuidForReport1621431425466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
alter table report alter column id set default uuid_generate_v4();
                                 `);
  }

  public async down(): Promise<void> {
    // pashёl nahuy
  }
}
