import { LobbyController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import express from 'express'

const lobbyRoutes = express.Router()

lobbyRoutes.get('/lobbies', LobbyController.all)
lobbyRoutes.get('/lobby/:id', LobbyController.byId)

lobbyRoutes.post('/lobby', restrict, LobbyController.createRoom)

export default lobbyRoutes
