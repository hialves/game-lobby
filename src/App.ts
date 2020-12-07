import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createConnection, getRepository } from 'typeorm'

import * as routes from '@routes/index'
import databaseConfig from './config/db'
import { errorHandler } from '@middlewares/error'
import { GameEntity, Lobby, Room, UserEntity } from '@entities/index'

class App {
  public app: express.Application

  constructor() {
    this.app = express()

    this.initializeMiddlewares()
    this.initializeRoutes()
    this.connectToTheDatabase()
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`)
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
  }

  private initializeRoutes() {
    Object.values(routes).forEach(router => {
      this.app.use('/', router)
    })

    this.app.use(errorHandler)
  }

  private async connectToTheDatabase() {
    try {
      const connection = await createConnection(databaseConfig)

      if (!connection.isConnected) await connection.connect()
      console.log('Database connected')
    } catch (e) {
      console.log(e)
    }
  }
}
export default App
