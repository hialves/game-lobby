import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { GameEntity, Lobby, UserEntity } from '@entity/index'
import {
  GameNotFoundException,
  RoomNotFoundException,
  UserNotFoundException,
} from '@exceptions/index'
import Room from '@entity/room.entity.class'
import { ContentCreated, JsonResponse } from '@utils/responses'
import { getUserId } from 'app/utils/request'

class LobbyController {
  async all(req: Request, res: Response) {
    const rooms = Lobby.getRooms()

    JsonResponse(res, rooms)
  }

  async byId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const room = Lobby.getRoomById(id)

    if (!room) {
      next(new RoomNotFoundException(id))
    } else {
      JsonResponse(res, room)
    }
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    const { title, gameId, maxUsers } = req.body

    const userId = getUserId(req)

    const game = await getRepository(GameEntity).findOne(gameId)
    const owner = await getRepository(UserEntity).findOne(userId)

    if (game && owner) {
      const room = new Room(title, Number(maxUsers), owner, game)

      Lobby.addRoom(room)

      ContentCreated(res, room)
    } else {
      if (!game) next(new GameNotFoundException(gameId))
      if (!owner) next(new UserNotFoundException(userId))
    }
  }
}

export default new LobbyController()
