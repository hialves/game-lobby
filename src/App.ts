import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createConnection } from 'typeorm'

import * as routes from '@routes/index'
import { errorHandler } from '@middlewares/error'
import { logger } from '@middlewares/logger'

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
    this.app.use(logger)
  }

  private initializeRoutes() {
    Object.values(routes).forEach(router => {
      this.app.use(router)
    })

    this.app.use(errorHandler)
  }

  private async connectToTheDatabase() {
    await createConnection()
  }
}
export default App
