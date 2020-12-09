import { capitalizeFirst } from '@utils/helpers'
import { HttpException } from './http.exception'

export class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `User with specified id ${id} not found`)
  }
}

export class UserFieldAlreadyInUseException extends HttpException {
  constructor(field: string) {
    super(409, `${capitalizeFirst(field)} already in use`)
  }
}
