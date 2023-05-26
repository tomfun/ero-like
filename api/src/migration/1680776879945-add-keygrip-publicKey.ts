import { QueryRunner } from 'typeorm';

export class addKeygripPublicKey1680776879945 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
    ALTER TABLE "publicKey"
        ADD "keygrip" bytea not null;
    `);
  }
}
