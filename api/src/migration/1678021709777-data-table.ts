import { QueryRunner } from 'typeorm';

export class dataTable1678021709777 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

        COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';

        CREATE TABLE "data"
        (
            id uuid DEFAULT public.uuid_generate_v4()
              constraint data_pk
                primary key,
            "createdAt" timestamp DEFAULT now() not null,
            type varchar not null,
            mime varchar not null,
            sha256 bytea not null,
            "clearSignDataPart" text not null CHECK ("clearSignDataPart" ~ '^[\\x00-\\x7F]*$')
        );
    `);
  }
}
