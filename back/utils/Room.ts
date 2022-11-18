import type { BroadcastOperator, Server, Socket } from "socket.io";
import { v4 } from 'uuid';
import Game from "./Game";

import type { TokenPayload } from "../socket/token";

export type Params = {
	sizeRow: number,
	sizeColumn: number,
	maxPlayer: number,
	speedStart: number,
	speedMin: number,
}

class Room {
	uid: string;
	name: string;
	games: Game[] = [];
	isStart: boolean = false;
	params: Params;
	checkFinish: NodeJS.Timer | undefined;
	winner: Game | undefined;
	socket: BroadcastOperator<any, any>;

	constructor(socket: Server, name: string, params: Params) {
		this.uid = v4();
		this.socket = socket.sockets.to(this.uid);
		this.name = name;
		this.params = params;
		console.log('Room: ', this.uid);
	}

	isEnd(): void {
		const isUp: Game[] = this.games.filter((game) => game.isStart)
		let winner: Game = this.games[0];

		if (!this.games.length) {
			this.isStart = false;
			clearInterval(this.checkFinish);
			return;
		} else if (!isUp.length) {
			for (let game of this.games) {
				if (game.score > winner.score) {
					winner = game;
				}
			}
			this.isStart = false;
		} else if (isUp.length == 1 && this.games.length > 1) {
			winner = isUp[0];
			winner.stopGame();
		} else {
			return;
		}
		this.isStart = false;
		clearInterval(this.checkFinish);
		this.socket.emit('game/end', { winnerName: winner.infoPlayer.username, score: winner.score })
	}

	start() {
		if (!this.isStart) {
			const seed = Math.random()
			this.checkFinish = setInterval(() => this.isEnd(), 1000)
			for (let game of this.games) {
				game.startGame(seed);
			}
			this.isStart = true;
		}
	}

	sendPlayers() {
		if (this.isStart) return;
		this.socket.emit('room/players', {
			numberPlayer: `${this.games.length} / ${this.params.maxPlayer}`,
			names: this.games.map((item) => item.infoPlayer.username),
		});
	}

	addPlayer(socketMe: Socket, infoPlayer: TokenPayload): string {
		if (this.games.length >= this.params.maxPlayer || this.isStart) return '';
		const game = new Game(this.socket, socketMe, infoPlayer, !this.games.length, this.params);
		this.games.push(game);
		socketMe.join(this.uid)
		console.log('new Player: ', game.uid);
		return game.uid;
	}

	updatePlayer(playerId: string, socketMe: Socket): boolean {
		const game = this.games.find((item) => item.uid == playerId)
		if (game) {
			if (!game.isConnect) {
				clearTimeout(game.timeoutDisconnectId);
				game.isConnect = true;
			}
			game.socketMe = socketMe;
			socketMe.join(this.uid);
			return true;
		}
		return false;
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

	disConnect(playerId: string) {
		const game = this.games.find((item) => item.uid == playerId)

		if (game) {
			game.isConnect = false
			game.timeoutDisconnectId = setTimeout(() => {
				if (!game.isConnect) this.leave(playerId)
			}, 5 * 1000)
		}
	}

	key(playerId: string, key: string) {
		const game = this.games.find((item) => item.uid == playerId);

		if (!game) return;
		if (game.isAdmin && key == 'Enter') this.start();
		if (game.isStart) {
			if (key == 'ArrowDown') game.fallPilePiece();
			if (key == 'ArrowUp') game.rotatePiece();
			if (key == 'ArrowRight') game.rightPiece();
			if (key == 'ArrowLeft') game.leftPiece();
			if (key == ' ') game.rotateVerticalyPiece();
		}
	}
}

export default Room;