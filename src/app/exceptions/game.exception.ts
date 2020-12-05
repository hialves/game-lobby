import { HttpException } from './http.exception'

export class GameNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Game with specified id ${id} not found`)
  }
}
