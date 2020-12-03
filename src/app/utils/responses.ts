import { Response } from 'express'

export function ContentCreated(res: Response, message?: string, json?: Object) {
	let responseObject = {}

	if (message) responseObject = { ...responseObject, message }
	if (json) responseObject = { ...responseObject, ...json }

	return res.status(201).json(responseObject)
}
