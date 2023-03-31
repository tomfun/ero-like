import { QueryRunner } from 'typeorm';

export class userNickIndex1679224949112 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
CREATE INDEX user_nick_idx ON "user"
    (nick text_pattern_ops);
    `);
  }
}
