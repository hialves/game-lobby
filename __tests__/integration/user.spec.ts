import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import { createConnection, getConnection } from 'typeorm'
import request from 'supertest'

import { revertMigrations, truncate } from '../utils/database'
import App from 'App'
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

  it('create a user', async () => {
    await request(app)
      .post('/user')
      .send(userData[0])
      .set('Application', 'application/json')
      .expect(201)
  })

  it('validates missing fields', async () => {
    await request(app)
      .post('/user')
      .send({ email: '' })
      .set('Application', 'application/json')
      .expect(422)

    await request(app)
      .post('/user')
      .send({ nickname: '' })
      .set('Application', 'application/json')
      .expect(422)

    await request(app)
      .post('/user')
      .send({ password: '' })
      .set('Application', 'application/json')
      .expect(422)
  })

  it('doesnt create a user with existing fields', async () => {
    await request(app)
      .post('/user')
      .send(userData[0])
      .set('Application', 'application/json')
      .expect(201)

    await request(app)
      .post('/user')
      .send(userData[1])
      .set('Application', 'application/json')
      .expect(409)

    await request(app)
      .post('/user')
      .send(userData[2])
      .set('Application', 'application/json')
      .expect(409)
  })

  it('returns a JSON array', async () => {
    await request(app).get('/users').expect(200).expect('Content-Type', /json/)
  })
})
