import { UserEntity } from '@entity/index'
import {
  InternalServerErrorException,
  UserNotFoundException,
} from '@exceptions/index'
import { ContentCreated, JsonResponse } from '@utils/responses'
import { NextFunction, Request, Response } from 'express'
import { getCustomRepository, getRepository } from 'typeorm'
import { hashPassword } from '@utils/helpers'
import { UserRepository } from '@repository/user.repository'
import { UserFieldAlreadyInUseException } from '@exceptions/user.exception'

class UserController {
  async all(req: Request, res: Response) {
    const users = await getRepository(UserEntity).find()

    JsonResponse(res, users)
  }

  async byId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const user = await getRepository(UserEntity).findOne(id)

    if (user) JsonResponse(res, user)
    else next(new UserNotFoundException(id))
  }

  async save(req: Request, res: Response, next: NextFunction) {
    const { nickname, email, password } = req.body
    try {
      const hashedPassword = await hashPassword(password)

      const userRepository = getCustomRepository(UserRepository)
      const user = new UserEntity()
      user.nickname = nickname
      user.email = email
      user.password = hashedPassword

      if (userRepository.checkIfExists('nickname', nickname)) {
        next(new UserFieldAlreadyInUseException('nickname'))
      } else if (userRepository.checkIfExists('email', email)) {
        next(new UserFieldAlreadyInUseException('email'))
      } else {
        const createdUser = await userRepository.save(user)
        ContentCreated(res, createdUser)
      }
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }

  async checkIfExists(req: Request, res: Response, next: NextFunction) {
    const { key, value } = req.params

    const userRepository = getCustomRepository(UserRepository)

    return JsonResponse(res, Boolean(userRepository.checkIfExists(key, value)))
  }
}

export default new UserController()
