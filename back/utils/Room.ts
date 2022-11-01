import type { BroadcastOperator, Server, Socket } from "socket.io";
import Game from "./Game";
import { v4 } from 'uuid';
import { threadId } from "worker_threads";
import { TokenPayload } from "../socket";
import Tetrimino from "./Tetrimino";

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
	params: Params = {sizeRow: 20, sizeColumn: 10, maxPlayer: 6};
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
		if (this.games.every((item) => !item.isStart)) {
			const seed = Math.random()
			for (let game of this.games) {
				game.startGame(seed);
			}
			this.isStart = true;
		}
	}

	addPlayer(socketMe: Socket, infoPlayer: TokenPayload): number {
		if (this.games.length >= this.params.maxPlayer || this.isStart) return -1;
		const game = new Game(this.socket, socketMe, infoPlayer);
		const indexPlayer =  this.games.push(game) - 1;
		console.log('new Player: ', indexPlayer);
		return indexPlayer;
	}

	updatePlayer(player:number, socketMe: Socket) {
		this.games[player].socketMe = socketMe;
	}

	leave(player:number) {
		this.games[player].stopGame();
		this.games[player].socketMe.leave(this.uid);
	}

	key(player: number, key: string) {
		// console.log('key: ', key, ', player: ', player);
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