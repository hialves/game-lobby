import { Room } from '@entity/index'

class Lobby {
  private static rooms: Room[]

  constructor() {
    Lobby.rooms = []
  }

  getRooms(filter = (r: Room) => true) {
    return Lobby.rooms.filter(room => filter(room))
  }

  getRoomById(id: string): Room | undefined {
    let firstRoom: Room | undefined

    Lobby.rooms.some(room => {
      if (room.id === id) {
        firstRoom = room

        return true
      }
    })

    return firstRoom
  }

  addRoom(room: Room) {
    Lobby.rooms.push(room)
  }

  removeRoom(id: string) {
    Lobby.rooms.filter(r => r.id !== id)
  }

  removeAllRooms() {
    Lobby.rooms = []
  }
}

export default new Lobby()
