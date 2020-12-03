import HttpException from 'app/exceptions/http.exception'
import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
	err: HttpException,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { status, message } = err

	return res.status(status).json({ message })
}
