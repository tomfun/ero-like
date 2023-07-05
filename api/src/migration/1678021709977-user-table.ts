import { QueryRunner } from 'typeorm'

export class userTable1678021709977 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
        CREATE TABLE "user"
        (
            id uuid DEFAULT public.uuid_generate_v4()
              constraint user_pk
                primary key,
            "agreementSignatureId"    uuid    not null
              constraint user_signature_agreement_fk
                references "signature" (id),
            "firstUpdateSignatureId"    uuid    not null
              constraint user_signature_first_fk
                references "signature" (id),
            "lastUpdateSignatureId"    uuid    not null
              constraint user_signature_last_fk
                references "signature" (id),
            "createdAt" timestamp DEFAULT now() not null,
            "updatedAt" timestamp,
            nick varchar not null
        );
    `)
  }
}
