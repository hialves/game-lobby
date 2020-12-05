import Room from './room.entity.class'

export default class Lobby {
	private rooms: Room[]

	constructor() {
		this.rooms = []
	}

	getRooms() {
		return this.rooms
	}

	getRoomById(id: string) {
		return this.findFirstRoomWithId(id)
	}

	addRoom(room: Room) {
		this.rooms.push(room)
	}

	removeRoom(id: string) {
		this.rooms.filter(r => r.id !== id)
	}

	findFirstRoomWithId(id: string): Room | undefined {
		let firstRoom: Room | undefined

		this.rooms.some(room => {
			if (room.id === id) {
				firstRoom = room

				return true
			}
		})

		return firstRoom
	}
}
