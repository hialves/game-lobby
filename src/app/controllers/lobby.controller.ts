import { NextFunction, request, Request, response, Response } from 'express'
import { getRepository } from 'typeorm'

import { GameEntity, Lobby } from '@entity/index'
import {
  GameNotFoundException,
  RoomNotFoundException,
  UnauthorizedRoomPermissionException,
  UserNotFoundException,
} from '@exceptions/index'
import Room, { IConfigRoom } from '@entity/room.entity.class'
import { ContentCreated, ContentDeleted, JsonResponse } from '@utils/responses'
import { OwnerNotFoundException } from '@exceptions/room.exception'

class LobbyController {
  async all(req: Request, res: Response) {
    const rooms = Lobby.getRooms()

    JsonResponse(res, rooms)
  }

  async byId(req: Request, res: Response, next: NextFunction) {
    const { room_id } = req.params

    const room = Lobby.getRoomById(room_id)

    if (!room) {
      next(new RoomNotFoundException(room_id))
    } else {
      JsonResponse(res, room)
    }
  }

  async getRoomsByGame(req: Request, res: Response) {
    const { game_id } = req.params

    const rooms = Lobby.getRooms(room => room.game.id === Number(game_id))

    JsonResponse(res, rooms)
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    const { title, game_id, config } = req.body

    const configRoom = config as IConfigRoom
    const owner = req.user
    const game = await getRepository(GameEntity).findOne(game_id)

    if (game && owner) {
      const room = new Room(title, configRoom, owner, game)

      Lobby.addRoom(room)

      ContentCreated(res, room)
    } else {
      if (!game) {
        next(new GameNotFoundException(game_id))
      } else if (!owner) {
        next(new OwnerNotFoundException())
      }
    }
  }

  async removeRoom(req: Request, res: Response, next: NextFunction) {
    const { room_id } = req.params

    const room = Lobby.getRoomById(room_id)
    const owner = req.user

    if (room && owner && room.owner.id === owner.id) {
      Lobby.removeRoom(room_id)

      ContentDeleted(res)
    } else {
      if (!room) {
        next(new RoomNotFoundException(room_id))
      } else if (room.owner.id !== owner.id) {
        next(new UnauthorizedRoomPermissionException())
      } else if (!owner) {
        next(new OwnerNotFoundException())
      }
    }
  }
}

export default new LobbyController()
