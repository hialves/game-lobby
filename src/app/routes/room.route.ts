import { RoomController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import express from 'express'

const roomRoutes = express.Router()

roomRoutes.post(
  '/room/:room_id/user/:user_id',
  restrict,
  RoomController.addUser,
)
roomRoutes.delete(
  '/room/:room_id/user/:user_id',
  restrict,
  RoomController.removeUser,
)

export default roomRoutes
