import HttpException from './http.exception'

export class UserNotFoundException extends HttpException {
	constructor(id: string) {
		super(404, `User with specified id ${id} not found`)
	}
}
