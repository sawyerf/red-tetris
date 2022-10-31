import { threadId } from 'worker_threads';
import Terrain from './Terrain';
import Tetrimino from './Tetrimino';
import type { BroadcastOperator, Socket } from 'socket.io';
import { cp } from 'fs';
import { TokenPayload } from '../socket';

class Game {
	terrain: Terrain = new Terrain(20, 10);
	tetrimo: Tetrimino = new Tetrimino();
	isStart: boolean = false;
	score: number = 0;
	infoPlayer: TokenPayload;
	intervalId: NodeJS.Timer = setInterval(() => { }, 1000);
	// Socket
	socket: BroadcastOperator<any, any>;
	socketMe: Socket;

	constructor(socket: BroadcastOperator<any, any>, socketMe: Socket, infoPlayer: TokenPayload) {
		this.socket = socket;
		this.socketMe = socketMe;
		this.infoPlayer = infoPlayer;
	}

	startGame(): void {
		this.terrain = new Terrain(20, 10);
		this.tetrimo = new Tetrimino();
		this.score = 0;
		clearInterval(this.intervalId);
		this.isStart = true;
		this.intervalId = setInterval(() => { this.fallPiece() }, 750);
		this.sendTerrainEveryone();
	}

	stopGame() {
		this.isStart = false;
		clearInterval(this.intervalId);
	}

	sendTerrainEveryone(): void {
		this.terrain.putPiece(this.tetrimo);
		this.socket.emit('game/terrain', {
			username: this.infoPlayer.username,
			idPlayer: this.infoPlayer.indexPlayer,
			terrain: this.terrain.terrain
		});
		this.terrain.delPiece(this.tetrimo);
	}

	sendTerrainMe(): void {
		this.terrain.putPiece(this.tetrimo);
		this.socketMe.emit('game/terrain', {
			username: this.infoPlayer.username,
			idPlayer: this.infoPlayer.indexPlayer,
			terrain: this.terrain.terrain
		});
		this.terrain.delPiece(this.tetrimo);
	}

	fallPiece(): void {
		if (this.terrain.isOnFloor(this.tetrimo)) { // Piece is on the floor
			this.terrain.putPiece(this.tetrimo);
			this.score += this.terrain.delFullLine();
			this.tetrimo = new Tetrimino();
			if (this.terrain.isPossible(this.tetrimo) == false) {
				this.stopGame();
			} else {
				this.sendTerrainEveryone();
			}
			return;
		}
		this.tetrimo.fall();
		this.sendTerrainMe();
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