import { UserEntity } from '@entity/index'
import {
  InternalServerErrorException,
  UserNotFoundException,
} from '@exceptions/index'
import { ContentCreated, JsonResponse } from '@utils/responses'
import { NextFunction, Request, Response } from 'express'
import { getCustomRepository, getRepository } from 'typeorm'
import { hashPassword } from '@utils/helpers'
import { UserRepository } from '@repository/index'
import { UserFieldAlreadyInUseException } from '@exceptions/user.exception'

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
      const hashedPassword = await hashPassword(password)

      const userRepository = getCustomRepository(UserRepository)
      const user = new UserEntity()
      user.nickname = nickname
      user.email = email
      user.password = hashedPassword

      if (await userRepository.checkIfExists('nickname', nickname)) {
        next(new UserFieldAlreadyInUseException('nickname'))
      } else if (await userRepository.checkIfExists('email', email)) {
        next(new UserFieldAlreadyInUseException('email'))
      } else {
        const createdUser = await userRepository.save(user)
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
