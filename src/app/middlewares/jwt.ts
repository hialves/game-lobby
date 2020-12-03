import jwt, { Secret } from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { IUser } from '@interfaces/user'

import { IUserRequest } from '@interfaces/custom'
import { UnauthorizedException } from 'app/exceptions/auth.exception'

export const restrict = (
	req: IUserRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.header('authorization')

	if (token) {
		jwt.verify(token, <Secret>process.env.JWT_KEY, function (err, decoded) {
			if (err) {
				next(new UnauthorizedException())
			} else {
				const user = <IUser>decoded
				req.userId = user.id

				next()
			}
		})
	} else {
		next(new UnauthorizedException())
	}
}
