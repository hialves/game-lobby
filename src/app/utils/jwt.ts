import jwt, { Secret } from 'jsonwebtoken'
import { IUser } from '@entity/user.entity'

export const generateToken = (user: IUser) => {
  let token = jwt.sign(user.id, <Secret>process.env.JWT_KEY, {
    expiresIn: '12h',
  })
  return token
}
