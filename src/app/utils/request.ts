import { Request } from 'express'

export function getUserId(req: Request) {
  return req.user.id
}
