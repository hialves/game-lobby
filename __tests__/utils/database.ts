import { getConnection, getManager } from 'typeorm'

export const truncate = async () => {
  await getManager().query('TRUNCATE TABLE "user"')
  await getManager().query('TRUNCATE TABLE "game"')
}

export const revertMigrations = async () => {
  for (let i in getConnection().migrations) {
    await getConnection().undoLastMigration()
  }
  return Promise.resolve()
}
