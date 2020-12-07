import Room from './room.entity.class'

class Lobby {
  private static rooms: Room[]

  constructor() {
    Lobby.rooms = []
  }

  getRooms() {
    return Lobby.rooms
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
}

export default new Lobby()
