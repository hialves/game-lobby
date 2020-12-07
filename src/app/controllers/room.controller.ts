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
      const { roomId, userId } = req.params

      const userData = await getRepository(UserEntity).findOne(userId)

      const owner = req.user

      const room = Lobby.getRoomById(roomId)

      if (room && owner && room.owner.id === owner.id && userData) {
        room.addUser(userData)

        ContentCreated(res, room)
      } else {
        if (!room) {
          next(new RoomNotFoundException(roomId))
        } else if (room.owner.id !== owner.id) {
          next(new UnauthorizedRoomPermissionException())
        }

        if (!userData) next(new UserNotFoundException(userId))
      }
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async removeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId, userId } = req.params

      const userData = await getRepository(UserEntity).findOne(userId)

      const owner = req.user

      const room = Lobby.getRoomById(roomId)

      if (room && owner && room.owner.id === owner.id && userData) {
        room.removeUser(userData.id)

        ContentDeleted(res)
      } else {
        if (!room) {
          next(new RoomNotFoundException(roomId))
        } else if (room.owner.id !== owner.id) {
          next(new UnauthorizedRoomPermissionException())
        }

        if (!userData) next(new UserNotFoundException(userId))
      }
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new RoomController()
