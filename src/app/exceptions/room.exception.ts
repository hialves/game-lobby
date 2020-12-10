import { HttpException } from './http.exception'

export class RoomNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Room with specified id ${id} not found`)
  }
}

export class UnauthorizedRoomPermissionException extends HttpException {
  constructor() {
    super(403, `You do not have permission to execute that action`)
  }
}

export class OwnerNotFoundException extends HttpException {
  constructor() {
    super(404, `Owner of room not found`)
  }
}

export class UserAlreadyInRoom extends HttpException {
  constructor() {
    super(409, 'User already in the room')
  }
}

export class UserNotInRoom extends HttpException {
  constructor() {
    super(409, "User isn't in the room")
  }
}

export class RemovingYourself extends HttpException {
  constructor() {
    super(409, 'You cant remove yourself')
  }
}
