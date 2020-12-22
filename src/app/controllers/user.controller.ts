import { UserEntity } from '@entity/index'
import {
  InternalServerErrorException,
  UserNotFoundException,
} from '@exceptions/index'
import { ContentCreated, JsonResponse } from '@utils/responses'
import { NextFunction, Request, Response } from 'express'
import { getCustomRepository, getRepository } from 'typeorm'
import { UserRepository } from '@repository/index'
import Queue from '@services/queue'
import RegistrationMail from '@jobs/registration-mail'
import UserValidator from './validators/user.validator'

class UserController {
  async all(req: Request, res: Response) {
    const users = await getRepository(UserEntity).find()

    JsonResponse(res, users)
  }

  async byId(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.params

    const user = await getRepository(UserEntity).findOne(user_id)

    if (user) JsonResponse(res, user)
    else next(new UserNotFoundException(user_id))
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { nickname, email, password } = req.body

    try {
      const userRepository = getCustomRepository(UserRepository)

      if (await UserValidator.create(req.body, next)) {
        const user = new UserEntity()
        user.nickname = nickname
        user.email = email
        user.password = password

        const createdUser = await userRepository.save(user)

        await Queue.add(RegistrationMail.key, { user })

        ContentCreated(res, createdUser)
      }
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }

  async checkIfExists(req: Request, res: Response) {
    const { key, value } = req.params

    const userRepository = getCustomRepository(UserRepository)

    JsonResponse(res, Boolean(await userRepository.checkIfExists(key, value)))
  }
}

export default new UserController()
