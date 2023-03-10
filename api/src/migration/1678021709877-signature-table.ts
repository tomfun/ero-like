import { QueryRunner } from 'typeorm';

export class signatureTable1678021709877 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
        CREATE TABLE signature
        (
            id uuid DEFAULT public.uuid_generate_v4()
              constraint signature_pk
                primary key,
            "dataId"    uuid    not null
              constraint signature_data_fk
                references "data" (id),
            "createdAt" timestamp DEFAULT now() not null,
            "signedAt" timestamp not null,
            hash varchar DEFAULT 'MD5' not null,
            "primaryKeyFingerprint" bytea not null,
            "subkeyFingerprint" bytea not null,
            "signature" bytea not null
        );
    `);
  }
}
