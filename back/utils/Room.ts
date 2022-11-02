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

	sendPlayers() {
		this.socket.emit('room/players', {
			numberPlayer: `${this.games.length} / ${this.params.maxPlayer}`,
			names: this.games.map((item) => item.infoPlayer.username),
		});
	}

	addPlayer(socketMe: Socket, infoPlayer: TokenPayload): string {
		if (this.games.length >= this.params.maxPlayer || this.isStart) return '';
		const game = new Game(this.socket, socketMe, infoPlayer, !this.games.length);
		this.games.push(game);
		socketMe.join(this.uid)
		console.log('new Player: ', game.uid);
		return game.uid;
	}

	updatePlayer(playerId: string, socketMe: Socket) {
		const game = this.games.find((item) => item.uid == playerId)
		if (game) {
			game.socketMe = socketMe;
		}
	}

	leave(playerId: string) {
		const game = this.games.find((item) => item.uid == playerId)
		if (game) {
			const indexGame = this.games.indexOf(game);
			game.stopGame();
			game.socketMe.leave(this.uid);
			this.games.splice(indexGame, 1);
			if (!indexGame && this.games[0]) {
				this.games[0].isAdmin = true;
			}
			this.sendPlayers();
		}
	}

	key(playerId: string, key: string) {
		// console.log('key: ', key, ', player: ', player);
		const game = this.games.find((item) => item.uid == playerId);

		if (!game) return ;
		if (game.isAdmin && key == 'Enter') this.start();
		if (this.isStart) {
			if (key == 'ArrowDown') game.fallPiece();
			if (key == 'ArrowUp') game.rotatePiece();
			if (key == 'ArrowRight') game.rightPiece();
			if (key == 'ArrowLeft') game.leftPiece();
			if (key == ' ') game.rotateVerticalyPiece();
		}
	}
}

export default Room;