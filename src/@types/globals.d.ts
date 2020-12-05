import Lobby from '../app/entities/lobby.entity.class'

declare global {
	namespace NodeJS {
		interface Global {
			lobbies: Lobby
		}
	}
}
