import isEmail from 'isemail'
import { NextFunction, Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { InternalServerErrorException } from '@exceptions/index'
import { JsonResponse } from '@utils/responses'
import { UserRepository } from '@repository/index'
import { LoginException } from '@exceptions/auth.exception'
import { compareHash } from '@utils/helpers'
import { generateToken } from '@utils/jwt'

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginCredential, password } = req.body

      const userRepository = getCustomRepository(UserRepository)

      let user = null

      if (isEmail.validate(loginCredential)) {
        user = await userRepository.checkIfExists('email', loginCredential)
      } else {
        user = await userRepository.checkIfExists('nickname', loginCredential)
      }

      if (user) {
        if (await compareHash(password, user.password)) {
          JsonResponse(res, { ...user, token: generateToken(user) })
        } else {
          next(new LoginException())
        }
      } else {
        next(new LoginException())
      }
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }
}

export default new AuthController()
