import Lobby from '../app/entities/lobby.class'

declare global {
	namespace NodeJS {
		interface Global {
			lobbies: Lobby
		}
	}
}
