import { QueryRunner } from 'typeorm'

export class signatureAddPacket1678828783428 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
        ALTER TABLE signature
            ADD packet bytea not null;
    `)
  }
}
