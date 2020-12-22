import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })
import { createConnection, getConnection, getManager } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import request from 'supertest'

import { clearLobby, revertMigrations, truncate } from '../utils/database'
import { Lobby, Room, UserEntity, GameEntity } from '@entity/index'
import App from 'App'

describe('Lobby', () => {
  let app = new App().app

  beforeAll(async () => {
    await createConnection()

    await getConnection().runMigrations()
  })

  beforeEach(async () => {
    await truncate()
    clearLobby()
  })

  afterAll(async () => {
    await revertMigrations()

    await getConnection().close()
  })

  it('should create a room', async (done) => {
    const user = await request(app)
      .post('/user')
      .send({
        email: 'user@test.com',
        nickname: 'testnick',
        password: '123456',
      })
      .set('Application', 'application/json')
      .expect(201)

    const userLogin = await request(app)
      .post('/login')
      .send({
        loginCredential: user.body.nickname,
        password: '123456',
      })
      .set('Application', 'application/json')
      .expect(200)

    const game = await request(app)
      .post('/game')
      .send({
        name: 'Test Game',
      })
      .set('Application', 'application/json')
      .expect(201)

    request(app)
      .post('/lobby')
      .send({
        title: 'Test Room',
        game_id: game.body.id,
        config: { private: true, maxUsers: 8 },
      })
      .set('Authorization', userLogin.body.token)
      .expect(201)
      .end((err, res) => {
        if (err) done(err)
        done()
      })
  })

  it('should get a room with specified id', async () => {
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
    const foundRoom = Lobby.getRoomById(room.id)

    expect(foundRoom).toBe(room)
  })

  it('should not get a room with specified id', async () => {
    let user = new UserEntity()
    user.email = 'user@test.com'
    user.nickname = 'testnick'
    user.password = '123456'
    await getManager().save(user)

    let game = new GameEntity()
    game.name = 'Test Game'
    await getManager().save(game)

    const room = new Room('testing', { private: true, maxUsers: 8 }, user, game)
    const id = uuidv4()

    Lobby.addRoom(room)
    const foundRoom = Lobby.getRoomById(id)

    expect(foundRoom).toBeUndefined()
  })

  it('should delete a room with specified id', async () => {
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
    Lobby.removeRoom(room.id)

    expect(Lobby.getRooms()).toHaveLength(0)
    expect(Lobby.getRooms()[0]).toBeUndefined()
  })

  it('should not delete a room with specified id', async () => {
    let user = new UserEntity()
    user.email = 'user@test.com'
    user.nickname = 'testnick'
    user.password = '123456'
    await getManager().save(user)

    let game = new GameEntity()
    game.name = 'Test Game'
    await getManager().save(game)

    const room = new Room('testing', { private: true, maxUsers: 8 }, user, game)
    const id = uuidv4()

    Lobby.addRoom(room)
    Lobby.removeRoom(id)

    expect(Lobby.getRoomById(room.id)).toBeDefined()
  })
})
