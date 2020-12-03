import 'dotenv/config'
import { ConnectionOptions } from 'typeorm'

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS } = process.env

const databaseConfig: ConnectionOptions = {
	type: 'postgres',
	url: `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@${POSTGRES_HOST}:5432/${POSTGRES_DB}`,
	entities: ['src/app/entities/*.entity.ts'],
	cli: {
		migrationsDir: 'migrations',
	},
}

export default databaseConfig
