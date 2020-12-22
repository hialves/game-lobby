import { GameEntity, Lobby, UserEntity } from '@entity/index'
import { getConnection, getManager } from 'typeorm'

export const truncate = async () => {
  await getManager().clear(UserEntity)
  await getManager().clear(GameEntity)
}

export const clearLobby = () => {
  Lobby.removeAllRooms()
}

export const revertMigrations = async () => {
  for (let i in getConnection().migrations) {
    await getConnection().undoLastMigration()
  }
  return Promise.resolve()
}
