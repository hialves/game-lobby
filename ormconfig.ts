require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS } = process.env

export default {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASS,
  database: POSTGRES_DB,

  entities: ['src/database/entity/*.entity.ts'],
  migrations: ['src/database/migration/*.ts'],
  subscribers: ['src/database/subscriber/*.subscriber.ts'],
  cli: {
    migrationsDir: 'src/database/migration',
    entitiesDir: 'src/database/entity',
    subscribersDir: 'src/database/subscriber',
  },
}
