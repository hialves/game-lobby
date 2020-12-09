import { GameEntity, UserEntity } from '@entity/index'
import {
  InternalServerErrorException,
  RoomNotFoundException,
  UnauthorizedRoomPermissionException,
} from '@exceptions/index'
import { UserNotFoundException } from '@exceptions/index'
import Lobby from '@entity/lobby.entity.class'
import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { ContentCreated, ContentDeleted } from 'app/utils/responses'

class RoomController {
  async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { room_id, user_id } = req.params

      const user = await getRepository(UserEntity).findOne(user_id)

      const owner = req.user

      const room = Lobby.getRoomById(room_id)

      if (room && owner && room.owner.id === owner.id && user) {
        room.addUser(user)

        ContentCreated(res, room)
      } else {
        if (!room) {
          next(new RoomNotFoundException(room_id))
        } else if (room.owner.id !== owner.id) {
          next(new UnauthorizedRoomPermissionException())
        } else if (!user) {
          next(new UserNotFoundException(user_id))
        }
      }
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async removeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { room_id, user_id } = req.params

      const user = await getRepository(UserEntity).findOne(user_id)

      const owner = req.user

      const room = Lobby.getRoomById(room_id)

      if (room && owner && room.owner.id === owner.id && user) {
        room.removeUser(user.id)

        ContentDeleted(res)
      } else {
        if (!room) {
          next(new RoomNotFoundException(room_id))
        } else if (room.owner.id !== owner.id) {
          next(new UnauthorizedRoomPermissionException())
        } else if (!user) {
          next(new UserNotFoundException(user_id))
        }
      }
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new RoomController()
