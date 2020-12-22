import { v4 as uuidv4 } from 'uuid'

import { GameEntity, UserEntity, Lobby } from '@entity/index'

export interface IConfigRoom {
  private: Boolean
  maxUsers: number
}

export default class Room {
  id: string
  title: string
  owner: UserEntity
  users: UserEntity[]
  game: GameEntity
  expireTime: ReturnType<typeof setTimeout>
  config: {
    private: Boolean
    maxUsers: number
  }

  constructor(
    title: string,
    config: IConfigRoom,
    owner: UserEntity,
    game: GameEntity,
  ) {
    this.id = uuidv4()
    this.title = title
    this.owner = owner
    this.users = [owner]
    this.config = config
    this.game = game
    this.resetTimer()
  }

  // TODO add only users that aren't inserted
  addUser(user: UserEntity) {
    if (this.users.length < this.config.maxUsers) {
      this.users = [...this.users, user]
    }
  }

  removeUser(id: number) {
    this.users.filter(u => u.id !== id)
  }

  transferOwner(nextOwner: UserEntity) {
    this.owner = nextOwner
    return this
  }

  editRoom(room: Room) {
    this.title = room.title
    this.game = room.game
    this.owner = room.owner
    this.config = room.config
    return this
  }

  toJson() {
    return {
      id: this.id,
      title: this.title,
      owner: this.owner,
      game: this.game,
      users: this.users,
      config: this.config,
    }
  }

  /**
   * Reset timer each time the room has activity
   */
  resetTimer() {
    clearTimeout(this.expireTime)

    this.expireTime = setTimeout(() => {
      Lobby.removeRoom(this.id)
      // 30mins to reset
    }, 1000 * 60 * 30)
  }
}
