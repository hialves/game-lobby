import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createConnection } from 'typeorm'
import { BullAdapter, router, setQueues } from 'bull-board'

import * as routes from '@routes/index'
import { errorHandler } from '@middlewares/error'
import { logger } from '@middlewares/logger'
import Queue from 'app/services/queue'

class App {
  public app: express.Application

  constructor() {
    this.app = express()

    this.initializeMiddlewares()
    this.initializeRoutes()
    this.connectToTheDatabase()
    if (process.env.NODE_ENV === 'development') this.initializeQueue()
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`)
    })
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

  private initializeQueue() {
    setQueues(
      Queue.queues.map(queue => {
        return new BullAdapter(queue.bull)
      }),
    )
    console.log('INITIALIZE QUEUES DEV')
    this.app.use('/dev/queues', router)
  }
}
export default App
