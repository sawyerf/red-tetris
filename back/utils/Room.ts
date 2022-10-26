import type { Socket } from "socket.io";
import Game from "./Game";

type Params {
	sizeRow: number,
	sizeColumn: number,
	maxPlayer: number,
}

class Room {
	games: Game[] = [];
	isStart: boolean = false;
	admin: number;
	params: Params = {sizeRow: 20, sizeColumn: 10, maxPlayer: 3};
	socket: Socket;

	constructor(socket: Socket) {
		this.socket = socket;
	}

	start() {
		for (let game of this.games) {
			game.startGame();
		}
		this.isStart = true;
	}

	addPlayer() {
		if (this.games.length >= this.params.maxPlayer) return;
		this.games.push(new Game(this.socket));
	}

	key(player: number, key: string) {
		if (!player && key == 'Enter') this.start();
		if (this.isStart) {
			if (key == 'ArrowDown') this.games[player].fallPiece();
			if (key == 'ArrowUp') this.games[player].rotatePiece();
			if (key == 'ArrowRight') this.games[player].rightPiece();
			if (key == 'ArrowLeft') this.games[player].leftPiece();
			if (key == ' ') this.games[player].rotateVerticalyPiece();
		}
	}
}