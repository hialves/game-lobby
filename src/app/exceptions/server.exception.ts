import { HttpException } from './http.exception'

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    console.log(message)

    super(500, `Internal Server Error`)
  }
}
