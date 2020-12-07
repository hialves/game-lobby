import 'dotenv/config'

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS } = process.env

export default {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASS,
  database: POSTGRES_DB,

  entities: ['src/database/entity/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/database/entity',
  },
}
