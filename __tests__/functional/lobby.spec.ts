import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })
import { createConnection, getConnection, getManager } from 'typeorm'

import { revertMigrations, truncate } from '../utils/database'
import { Lobby, Room, UserEntity, GameEntity } from '@entity/index'

describe('Lobby', () => {
  beforeAll(async () => {
    await createConnection()

    await getConnection().runMigrations()
  })

  beforeEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await revertMigrations()

    await getConnection().close()
  })

  it('should create a room', async () => {
    let user = new UserEntity()
    user.email = 'user@test.com'
    user.nickname = 'testnick'
    user.password = '123456'
    await getManager().save(user)

    let game = new GameEntity()
    game.name = 'Test Game'
    await getManager().save(game)

    const room = new Room('testing', { private: true, maxUsers: 8 }, user, game)

    Lobby.addRoom(room)

    expect(Lobby.getRooms()).toHaveLength(1)
  })
})
