import { UserEntity } from '@entities/index'

declare global {
  namespace Express {
    export interface Request {
      user: UserEntity
    }
  }
}
