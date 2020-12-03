import { GameEntity, UserEntity } from '@entities/index'
import { IUserRequest } from '@interfaces/custom'
import {
	RoomNotFoundException,
	UnauthorizedRoomPermissionException,
} from 'app/exceptions/room.exception'
import { UserNotFoundException } from 'app/exceptions/user.exception'
import Lobby from '@entities/lobby.class'
import Room from '@entities/room.class'
import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

class RoomController {
	async byId(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params

		const room = global.lobbies.findFirstRoomWithId(id)

		if (room === null) {
			return next(new RoomNotFoundException(id))
		} else {
			return res.status(200).json(room)
		}
	}

	async addUser(req: IUserRequest, res: Response, next: NextFunction) {
		const { roomId, usersId } = req.params

		const usersIdArray: string[] = Array.from(JSON.parse(usersId))

		const usersData = await getRepository(UserEntity)
			.createQueryBuilder('user')
			.whereInIds(usersIdArray)
			.execute()

		const ownerId = req.userId

		const room = global.lobbies.findFirstRoomWithId(roomId)
		const owner = await getRepository(UserEntity).findOne(ownerId)

		if (!room) return next(new RoomNotFoundException(roomId))
		if (!owner) return next(new UserNotFoundException(ownerId))
		if (room.owner.id !== ownerId) {
			return next(new UnauthorizedRoomPermissionException())
		}

		room.addUsers(usersData)

		return res.status(201).json(room)
	}
}

export default new RoomController()
