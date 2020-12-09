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
