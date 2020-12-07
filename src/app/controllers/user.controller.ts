import { UserEntity } from '@entity/index'
import { UserNotFoundException } from '@exceptions/index'
import { JsonErrorValidation, JsonResponse } from '@utils/responses'
import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { validationErrorConfig } from 'config/validate'

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

    const userRepository = getRepository(UserEntity)
    // TODO hash password
    const user = userRepository.create(req.body)

    const errors = await validate(user, validationErrorConfig)
    if (errors.length > 0) {
      JsonErrorValidation(res, errors)
    } else {
      userRepository.save(user)
    }
  }
}

export default new UserController()
