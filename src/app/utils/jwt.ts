import jwt, { Secret } from 'jsonwebtoken'
import { IUser } from '@interfaces/user'

export const generateToken = (user: IUser) => {
	let token = jwt.sign(user, <Secret>process.env.JWT_KEY, {
		expiresIn: '12h',
	})
	return token
}
