import { Response } from 'express'

export function ContentCreated(res: Response, json: Object) {
  res.status(201).json(json)
}

export function JsonResponse(res: Response, json: Object | undefined) {
  let responseObject = {}

  if (json) responseObject = { ...responseObject, ...json }

  res.status(200).json(responseObject)
}
