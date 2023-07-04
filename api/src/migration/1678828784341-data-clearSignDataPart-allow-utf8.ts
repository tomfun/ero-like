import { QueryRunner } from 'typeorm'

export class dataClearSignDataPartAllowUtf81678828784341 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
        ALTER TABLE data
            DROP CONSTRAINT "data_clearSignDataPart_check";
    `)
  }
}
