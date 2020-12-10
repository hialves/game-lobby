import jwt, { Secret } from 'jsonwebtoken'
import { IUser } from '@entity/user.entity'

export const generateToken = (user: IUser) => {
  let token = jwt.sign({ id: user.id }, <Secret>process.env.JWT_KEY, {
    expiresIn: 60 * 60 * 12,
  })
  return token
}
