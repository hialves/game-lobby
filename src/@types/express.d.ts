import { UserEntity } from '@entity/index'

declare global {
  namespace Express {
    export interface Request {
      user: UserEntity
    }
  }
}
