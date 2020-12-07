import { MigrationInterface, QueryRunner } from 'typeorm'

export class GameMigration1607304892300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "game" (id serial PRIMARY KEY, name VARCHAR (50), created_at TIMESTAMP, updated_at TIMESTAMP);',
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE game;')
  }
}
