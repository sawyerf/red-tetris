import { threadId } from 'worker_threads';
import type { BroadcastOperator, Socket } from 'socket.io';
import { v4 } from 'uuid';

import Terrain from './Terrain';
import Tetrimino from './Tetrimino';
import type { TokenPayload } from '../socket/token';
import Room, { Params } from './Room';

class Game {
	uid: string;
	isStart: boolean = false;
	room: Room;
	// Terrain & Tetri
	terrain: Terrain = new Terrain(0, 0);
	tetrimo: Tetrimino = new Tetrimino(0, 1);
	nextTetrimo: Tetrimino = new Tetrimino(0, 1);
	// Player info
	score: number = 0;
	isConnect: boolean = true;
	timeoutDisconnectId: NodeJS.Timer|undefined;
	params: Params;
	infoPlayer: TokenPayload;
	// Speed
	intervalTime: number = 700;
	minSpeed: number = 200;
	intervalId: NodeJS.Timer|undefined;
	// Socket
	socket: BroadcastOperator<any, any>;
	socketMe: Socket;
	isAdmin: boolean;


	constructor(socket: BroadcastOperator<any, any>, socketMe: Socket, infoPlayer: TokenPayload, isAdmin: boolean, params: Params, room: Room) {
		this.uid = v4();
		this.socket = socket;
		this.socketMe = socketMe;
		this.infoPlayer = infoPlayer;
		this.isAdmin = isAdmin;
		this.intervalTime = params.speedStart;
		this.params = params;
		this.room = room;
	}

	startGame(seed: number): void {
		this.terrain = new Terrain(this.params.sizeRow, this.params.sizeColumn);
		this.tetrimo = new Tetrimino(seed, this.params.sizeColumn);
		this.nextTetrimo = new Tetrimino(seed, this.params.sizeColumn);
		this.nextTetrimo.newPiece();
		this.score = 0;
		clearInterval(this.intervalId);
		this.isStart = true;
		this.intervalId = setInterval(() => { this.fallPiece() }, this.intervalTime);
		this.sendTerrainEveryone();
		this.sendPiece();
	}

	stopGame() {
		this.isStart = false;
		this.terrain.endGame();
		this.sendTerrainEveryone();
		clearInterval(this.intervalId);
	}

	sendTerrainEveryone(): void {
		this.socket.emit('game/oponent', {
			username: this.infoPlayer.username,
			idPlayer: this.infoPlayer.idPlayer,
			terrain: this.terrain.terrain,
			score: this.score,
		});
		this.sendTerrainMe();
	}

	sendTerrainMe(): void {
		if (this.isStart) {
			this.terrain.putShadow(this.tetrimo);
			this.terrain.putPiece(this.tetrimo);
		}
		this.socketMe.emit('game/terrain', {
			terrain: this.terrain.terrain,
			score: this.score,
		});
		if (this.isStart) {
			this.terrain.delPiece(this.tetrimo);
			this.terrain.delShadow();
		}
	}

	sendPiece(): void {
		this.socketMe.emit('game/pieces', {currentPiece: this.tetrimo.get(), nextPiece: this.nextTetrimo.get()})
	}

	fallPiece(): void {
		if (!this.isStart) return ;
		if (this.terrain.isOnFloor(this.tetrimo)) { // Piece is on the floor
			this.terrain.putPiece(this.tetrimo);
			const appendScore: number = this.terrain.delFullLine();
			if (appendScore) {
				clearInterval(this.intervalId);
				this.intervalTime -= appendScore * 10;
				if (this.intervalTime < this.params.speedMin) this.intervalTime = this.params.speedMin;
				this.intervalId = setInterval(() => { this.fallPiece() }, this.intervalTime);
				this.room.addMalus(appendScore - 1, this.infoPlayer.idPlayer);
				this.terrain.delMalus(appendScore - 1);
			}
			this.score += appendScore;
			if (this.terrain.isPossible(this.nextTetrimo) == false) {
				this.stopGame();
			} else {
				this.tetrimo.newPiece();
				this.nextTetrimo.newPiece();
				this.sendPiece();
			}
			this.sendTerrainEveryone();
			return;
		}
		this.tetrimo.fall();
		this.sendTerrainMe();
	}

	addMalus(malus: number) {
		if (malus > 0) {
			this.terrain.addMalus(malus);
			this.sendTerrainEveryone();
		}
	}

	fallPilePiece(): void {
		while (true) {
			if (this.terrain.isOnFloor(this.tetrimo)) {
				this.fallPiece();
				return ;
			}
			this.tetrimo.fall();
		}
	}

	rightPiece(): void {
		this.tetrimo.right()
		if (this.terrain.isPossible(this.tetrimo)) return this.sendTerrainMe();
		this.tetrimo.left();
	}

	leftPiece(): void {
		this.tetrimo.left()
		if (this.terrain.isPossible(this.tetrimo)) return this.sendTerrainMe();
		this.tetrimo.right();
	}

	rotatePiece(): void {
		this.tetrimo.rotate()
		if (this.terrain.isPossible(this.tetrimo)) return this.sendTerrainMe();
		this.tetrimo.deRotate();
	}

	rotateVerticalyPiece(): void {
		this.tetrimo.rotateVerticaly()
		if (this.terrain.isPossible(this.tetrimo)) return this.sendTerrainMe();
		this.tetrimo.rotateVerticaly();
	}

	ngOnInit(): void {
	}
}

export default Game;
