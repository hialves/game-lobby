import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { GameEntity, Lobby } from '@entity/index'
import { GameNotFoundException, RoomNotFoundException } from '@exceptions/index'
import Room, { IConfigRoom } from '@entity/room.entity.class'
import { ContentCreated, JsonResponse } from '@utils/responses'

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

  async getRoomsByGame(req: Request, res: Response, next: NextFunction) {
    const { game_id } = req.params

    const rooms = Lobby.getRooms(room => room.game.id === game_id)

    JsonResponse(res, rooms)
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    const { title, gameId, config } = req.body

    const configRoom = JSON.parse(config) as IConfigRoom
    const owner = req.user
    const game = await getRepository(GameEntity).findOne(gameId)

    if (game && owner) {
      const room = new Room(title, configRoom, owner, game)

      Lobby.addRoom(room)

      ContentCreated(res, room)
    } else {
      if (!game) next(new GameNotFoundException(gameId))
    }
  }
}

export default new LobbyController()
