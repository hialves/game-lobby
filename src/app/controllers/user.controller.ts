import { UserEntity } from '@entity/index'
import {
  InternalServerErrorException,
  UserNotFoundException,
} from '@exceptions/index'
import {
  ContentCreated,
  JsonErrorValidation,
  JsonResponse,
} from '@utils/responses'
import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { validationErrorConfig } from 'config/validate'
import { hashPassword } from '@utils/helpers'
import bcrypt from 'bcryptjs'

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

      const userRepository = getRepository(UserEntity)
      const user = new UserEntity()
      user.nickname = nickname
      user.email = email
      user.password = hashedPassword

      const errors = await validate(user, validationErrorConfig)
      if (errors.length > 0) {
        JsonErrorValidation(res, errors)
      } else {
        const createdUser = await userRepository.save(user)
        ContentCreated(res, createdUser)
      }
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }
}

export default new UserController()
