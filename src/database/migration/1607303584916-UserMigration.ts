import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserMigration1607303584916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
        id serial PRIMARY KEY, 
        nickname VARCHAR (100) UNIQUE NOT NULL, 
        email VARCHAR (255) UNIQUE NOT NULL, 
        password VARCHAR (255) NOT NULL, 
        created_at TIMESTAMP DEFAULT NOW(), 
        updated_at TIMESTAMP DEFAULT NOW()
      );`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "user";')
  }
}
