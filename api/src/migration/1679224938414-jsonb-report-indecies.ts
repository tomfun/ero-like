import { QueryRunner } from 'typeorm'

export class jsonbReportIndecies1679224938414 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
DROP INDEX report_d_substances_name_idx;

-- https://medium.com/@thegalang/indexing-in-postgresql-and-applying-it-to-jsonb-c99ecf50a443

create or replace function jsonb_qvalues_of_key(jsonb, wanted_key text)
    returns text
    language sql
    immutable
as $$
    select array_to_string(array(select attr.value from jsonb_array_elements($1) arrayElem, jsonb_each(arrayElem) attr WHERE attr.key=wanted_key),' ')
$$;

create or replace function jsonb_values_of_key(jsonb, wanted_key text)
    returns text
    language sql
    immutable
as $$
    select array_to_string(array(select attr.value from jsonb_array_elements($1) arrayElem, jsonb_each_text(arrayElem) attr WHERE attr.key=wanted_key),' ')
$$;

CREATE INDEX report_d_substances_name_idx ON report
    USING gin (jsonb_values_of_key(d->'substances', 'namePsychonautWikiOrg') gin_trgm_ops)
    WHERE type = 'ReportEntity';
    `)
  }
}
