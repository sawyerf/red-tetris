import type { BroadcastOperator, Server } from "socket.io";
import Game from "./Game";
import { v4 } from 'uuid';

type Params = {
	sizeRow: number,
	sizeColumn: number,
	maxPlayer: number,
}

class Room {
	uid: string;
	name: string;
	games: Game[] = [];
	isStart: boolean = false;
	params: Params = {sizeRow: 20, sizeColumn: 10, maxPlayer: 3};
	winner: Game | undefined;
	socket: BroadcastOperator<any, any>;

	constructor(socket: Server, name: string) {
		this.uid = v4();
		this.socket = socket.sockets.to(this.uid);
		this.name = name;
		console.log('Room: ', this.uid);
	}

	isEnd() {
		const isEnd:boolean = this.games.every((game) => !game.isStart)
		let winner: Game = this.games[0];

		if (isEnd) {
			for (let game of this.games) {
				if (game.score > winner.score) {
					winner = game;
				}
			}
		}
		console.log('winner is ', winner);
		return isEnd;
	}

	start() {
		for (let game of this.games) {
			game.startGame();
		}
		this.isStart = true;
	}

	addPlayer(): number {
		if (this.games.length >= this.params.maxPlayer || this.isStart) return -1;
		const game = new Game(this.socket);
		const indexPlayer =  this.games.push(game) - 1;
		console.log('new Player: ', indexPlayer);
		return indexPlayer;
	}

	key(player: number, key: string) {
		console.log('key: ', key, ', player: ', player);
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

export default Room;