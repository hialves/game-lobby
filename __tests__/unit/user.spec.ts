import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import request from 'supertest'
import { createConnection, getConnection, getCustomRepository } from 'typeorm'

import { UserEntity } from '@entity/index'
import { UserRepository } from '@repository/index'
import { compareHash } from '@utils/helpers'
import App from 'App'
import { revertMigrations, truncate } from '../utils/database'
import userData from '../user-data.json'

describe('User', () => {
  let app = new App().app

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

  it('encrypt user password', async () => {
    const userRepository = getCustomRepository(UserRepository)
    //const user = new UserEntity()
    const user = userData[0] as UserEntity

    const createdUser = await userRepository.save(user)

    const result = await compareHash('123456', createdUser.password)

    expect(result).toBe(true)
  })
})
