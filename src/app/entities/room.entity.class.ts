import { v4 as uuidv4 } from 'uuid'

import { GameEntity, UserEntity } from '@entities/index'

export default class Room {
  id: string
  title: string
  owner: UserEntity
  users: UserEntity[]
  maxUsers: number
  game: GameEntity
  expireTime: ReturnType<typeof setTimeout>

  constructor(
    title: string,
    maxUsers: number,
    owner: UserEntity,
    game: GameEntity,
  ) {
    this.id = uuidv4()
    this.title = title
    this.owner = owner
    this.users = [owner]
    this.maxUsers = maxUsers
    this.game = game
    this.resetTimer()
  }

  // TODO add only users that aren't inserted
  addUsers(users: UserEntity[]) {
    this.users = [...this.users, ...users]
  }

  removeUser(id: string) {
    this.users.filter(u => u.id !== id)
  }

  transferOwner(nextOwner: UserEntity) {
    this.owner = nextOwner
  }

  resetTimer() {
    clearTimeout(this.expireTime)

    this.expireTime = setTimeout(() => {
      global.lobbies.removeRoom(this.id)
    }, 60 * 30)
  }
}
