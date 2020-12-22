import { capitalizeFirst } from '@utils/helpers'
import { HttpException } from './http.exception'

export class GameNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Game with specified id ${id} not found`)
  }
}

export class GameAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(409, `${capitalizeFirst(name)} already exists`)
  }
}
