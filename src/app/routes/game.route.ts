import { GameController } from '@controllers/index'
import express from 'express'

const gameRoutes = express.Router()

gameRoutes.get('/games', GameController.all)
gameRoutes.get('/game/:game_id', GameController.byId)
gameRoutes.get('/game/exists/:key/:value', GameController.checkIfExists)
gameRoutes.post('/game', GameController.create)
gameRoutes.delete('/game/:game_id', GameController.deleteGame)

export default gameRoutes
