import { NextFunction, Request, Response } from 'express'
import { getCustomRepository, getRepository } from 'typeorm'

import { GameEntity } from '@entity/index'
import {
  GameNotFoundException,
  InternalServerErrorException,
} from '@exceptions/index'
import { ContentCreated, ContentDeleted, JsonResponse } from '@utils/responses'
import { GameRepository } from '@repository/index'
import { GameAlreadyExistsException } from '@exceptions/index'
import { isValid } from '@utils/helpers'
import { InvalidFieldValueException } from '@exceptions/server.exception'

class GameController {
  async all(req: Request, res: Response) {
    const games = await getRepository(GameEntity).find()

    JsonResponse(res, games)
  }

  async byId(req: Request, res: Response, next: NextFunction) {
    const { game_id } = req.params

    const user = await getRepository(GameEntity).findOne(game_id)

    if (user) JsonResponse(res, user)
    else next(new GameNotFoundException(game_id))
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body
    try {
      const gameRepository = getCustomRepository(GameRepository)
      const game = new GameEntity()
      game.name = name

      if (await gameRepository.checkIfExists('name', name)) {
        next(new GameAlreadyExistsException(name))
      } else if (!isValid(name)) {
        next(new InvalidFieldValueException('name'))
      } else {
        const createdGame = await gameRepository.save(game)

        ContentCreated(res, createdGame)
      }
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }

  async checkIfExists(req: Request, res: Response) {
    const { key, value } = req.params

    const gameRepository = getCustomRepository(GameRepository)

    JsonResponse(res, Boolean(await gameRepository.checkIfExists(key, value)))
  }

  async deleteGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { game_id } = req.params

      const gameRepository = getCustomRepository(GameRepository)
      const game = await gameRepository.findOne(game_id)

      if (game) {
        await gameRepository.delete(game_id)

        ContentDeleted(res)
      } else {
        if (!game) next(new GameNotFoundException(game_id))
      }
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new GameController()
