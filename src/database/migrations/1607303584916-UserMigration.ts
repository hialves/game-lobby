import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserMigration1607303584916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "user" (id serial PRIMARY KEY, nickname VARCHAR (50) UNIQUE NOT NULL, email VARCHAR (255) UNIQUE NOT NULL, password VARCHAR (50) NOT NULL, created_at TIMESTAMP, updated_at TIMESTAMP)',
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE user')
  }
}
