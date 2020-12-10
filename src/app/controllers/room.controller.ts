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
import {
  RemovingYourself,
  UserAlreadyInRoom,
  UserNotInRoom,
} from '@exceptions/room.exception'
import Room, { IConfigRoom } from '@entity/room.entity.class'
import { isValid } from '@utils/helpers'
import { isObject } from 'class-validator'

class RoomController {
  async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { room_id, user_id } = req.params

      const user = await getRepository(UserEntity).findOne(user_id)

      const owner = req.user

      const room = Lobby.getRoomById(room_id)

      if (
        room &&
        owner &&
        user &&
        room.owner.id === owner.id &&
        !room.users.includes(user)
      ) {
        room.addUser(user)

        ContentCreated(res, room)
      } else {
        if (!room) {
          next(new RoomNotFoundException(room_id))
        } else if (room.owner.id !== owner.id) {
          next(new UnauthorizedRoomPermissionException())
        } else if (!user) {
          next(new UserNotFoundException(user_id))
        } else if (room.users.includes(user)) {
          next(new UserAlreadyInRoom())
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

      if (
        room &&
        owner &&
        user &&
        room.owner.id === owner.id &&
        room.users.includes(user) &&
        room.owner.id !== Number(user_id)
      ) {
        room.removeUser(user.id)

        ContentDeleted(res)
      } else {
        if (!room) {
          next(new RoomNotFoundException(room_id))
        } else if (room.owner.id !== owner.id) {
          next(new UnauthorizedRoomPermissionException())
        } else if (!user) {
          next(new UserNotFoundException(user_id))
        } else if (!room.users.includes(user)) {
          next(new UserNotInRoom())
        } else if (room.owner.id === Number(user_id)) {
          next(new RemovingYourself())
        }
      }
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async editRoom(req: Request, res: Response, next: NextFunction) {
    const { room_id, title, game_id, config } = req.body

    const configRoom = config as IConfigRoom
    const game = await getRepository(GameEntity).findOne(game_id)
    const room = Lobby.getRoomById(room_id)
    const owner = req.user

    if (
      room &&
      game &&
      owner &&
      isValid(title) &&
      isObject(configRoom) &&
      room.owner.id === owner.id
    ) {
      const editedRoom = new Room(title, configRoom, owner, game)
      room.editRoom(editedRoom)
    }
  }
}

export default new RoomController()
