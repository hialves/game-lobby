import { LobbyController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import express from 'express'

const lobbyRoutes = express.Router()

lobbyRoutes.get('/lobbies', LobbyController.all)
lobbyRoutes.get('/lobby/:id', LobbyController.byId)
lobbyRoutes.delete(
  '/lobbies/room/:room_id',
  restrict,
  LobbyController.removeRoom,
)
lobbyRoutes.get('/lobbies/game/:game_id', LobbyController.getRoomsByGame)

lobbyRoutes.post('/lobby', restrict, LobbyController.createRoom)

export default lobbyRoutes
