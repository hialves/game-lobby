import { GameEntity, UserEntity } from '@entities/index'
import {
  RoomNotFoundException,
  UnauthorizedRoomPermissionException,
} from '@exceptions/index'
import { UserNotFoundException } from '@exceptions/index'
import Lobby from '@entities/lobby.entity.class'
import Room from '@entities/room.entity.class'
import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { ContentCreated } from 'app/utils/responses'

class RoomController {
  async addUser(req: Request, res: Response, next: NextFunction) {
    const { roomId, usersId } = req.params

    const usersIdArray: string[] = Array.from(JSON.parse(usersId))

    const usersData = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .whereInIds(usersIdArray)
      .execute()

    const ownerId = req.user.id

    const room = global.lobbies.findFirstRoomWithId(roomId)
    const owner = await getRepository(UserEntity).findOne(ownerId)

    if (room && owner && room.owner.id === ownerId) {
      room.addUsers(usersData)

      ContentCreated(res, room)
    } else {
      if (!room) {
        next(new RoomNotFoundException(roomId))
      } else if (room.owner.id !== ownerId) {
        next(new UnauthorizedRoomPermissionException())
      }

      if (!owner) next(new UserNotFoundException(ownerId))
    }
  }
}

export default new RoomController()
