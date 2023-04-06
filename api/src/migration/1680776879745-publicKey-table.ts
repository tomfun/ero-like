import { QueryRunner } from 'typeorm';

export class blockTable1680776879745 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
        CREATE TYPE "blockType" AS ENUM (
            -- 'PGP SIGNED MESSAGE',
            'PGP SIGNATURE',
            'PGP MESSAGE',
            'PGP PUBLIC KEY BLOCK',
            'PGP PRIVATE KEY BLOCK'
            );

    CREATE TABLE "block"
        (
            id                      uuid    DEFAULT public.uuid_generate_v4()
                constraint "block_pk"
                    primary key,
            "createdAt"    timestamp DEFAULT now()  not null,
            type           "blockType"              not null,
            "blockArmored" text                     not null
                CHECK ("blockArmored" ~ '^[\\x00-\\x7F]*$')
        );

    CREATE TABLE "publicKey"
        (
            id                      uuid    DEFAULT public.uuid_generate_v4()
                constraint "publicKey_pk"
                    primary key,
            "userId"                uuid    null
                constraint "publicKey_user_id_fk"
                    references "user",
            "blockId"                uuid    not null
                constraint "publicKey_block_id_fk"
                    references "block",
            "createdAt" timestamp DEFAULT now() not null,
            "updatedAt" timestamp DEFAULT now() not null,
            "invalidAt" timestamp           null,
            "isHistory"             bool    not null,
            "primaryKeyFingerprint" bytea   not null,
            "publicKeyFingerprint"  bytea   not null,
            "publicKey"             bytea   not null
        );

    ALTER TABLE "user"
        DROP "firstUpdateSignatureId";

    ALTER TABLE "user"
        DROP "lastUpdateSignatureId";

    ALTER TABLE signature
        ADD "userId" uuid;

    ALTER TABLE signature
        ADD "blockId" uuid not null;

    ALTER TABLE signature
        ADD constraint signature_user_id_fk
            foreign key ("userId") references "user";

    ALTER TABLE signature
        ADD constraint signature_block_id_fk
            foreign key ("blockId") references "block";

    CREATE INDEX publicKey_publicKeyId_idx ON "publicKey" ("publicKeyFingerprint");

    `);
  }
}
