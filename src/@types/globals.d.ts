import Lobby from '../database/entity/lobby.entity.class'

declare global {
  namespace NodeJS {
    interface Global {
      lobbies: Lobby
    }
  }
}
