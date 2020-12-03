import { GameEntity, UserEntity } from '@entities/index'
import { IUserRequest } from '@interfaces/custom'
import { GameNotFoundException } from 'app/exceptions/game.exception'
import { RoomNotFoundException } from 'app/exceptions/room.exception'
import { UserNotFoundException } from 'app/exceptions/user.exception'
import Lobby from '@entities/lobby.class'
import Room from '@entities/room.class'
import { ContentCreated } from 'app/utils/responses'
import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

class LobbyController {
	async all(req: Request, res: Response) {
		const rooms = global.lobbies.getRooms()

		return res.status(200).json(rooms)
	}

	async byId(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params

		const room = global.lobbies.findFirstRoomWithId(id)

		if (room === null) {
			return next(new RoomNotFoundException(id))
		} else {
			return res.status(200).json(room)
		}
	}

	async createRoom(req: IUserRequest, res: Response, next: NextFunction) {
		const { title, gameId, maxUsers } = req.params

		const userId = req.userId

		const game = await getRepository(GameEntity).findOne(gameId)
		const owner = await getRepository(UserEntity).findOne(userId)

		if (!game) return next(new GameNotFoundException(gameId))
		if (!owner) return next(new UserNotFoundException(userId))

		const room = new Room(title, Number(maxUsers), owner, game)

		global.lobbies.addRoom(room)

		return ContentCreated(res, 'Room created!', room)
	}
}

export default new LobbyController()
