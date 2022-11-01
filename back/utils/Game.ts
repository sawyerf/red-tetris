import { threadId } from 'worker_threads';
import Terrain from './Terrain';
import Tetrimino from './Tetrimino';
import type { BroadcastOperator, Socket } from 'socket.io';
import { cp } from 'fs';
import { TokenPayload } from '../socket';

class Game {
	terrain: Terrain = new Terrain(20, 10);
	tetrimo: Tetrimino = new Tetrimino(0);
	nextTetrimo: Tetrimino = new Tetrimino(0);
	isStart: boolean = false;
	score: number = 0;
	infoPlayer: TokenPayload;
	intervalId: NodeJS.Timer = setInterval(() => { }, 200);
	// Socket
	socket: BroadcastOperator<any, any>;
	socketMe: Socket;

	constructor(socket: BroadcastOperator<any, any>, socketMe: Socket, infoPlayer: TokenPayload) {
		this.socket = socket;
		this.socketMe = socketMe;
		this.infoPlayer = infoPlayer;
	}

	startGame(seed: number): void {
		this.terrain = new Terrain(20, 10);
		this.tetrimo = new Tetrimino(seed);
		this.nextTetrimo = new Tetrimino(this.tetrimo.seed);
		this.score = 0;
		clearInterval(this.intervalId);
		this.isStart = true;
		this.intervalId = setInterval(() => { this.fallPiece() }, 750);
		this.sendTerrainEveryone();
		this.sendPiece();
	}

	stopGame() {
		this.isStart = false;
		clearInterval(this.intervalId);
	}

	sendTerrainEveryone(): void {
		this.terrain.putPiece(this.tetrimo);
		this.socket.emit('game/oponent', {
			username: this.infoPlayer.username,
			idPlayer: this.infoPlayer.indexPlayer,
			terrain: this.terrain.terrain,
			score: this.score,
		});
		this.terrain.delPiece(this.tetrimo);
		this.sendTerrainMe();
	}

	sendTerrainMe(): void {
		this.terrain.putPiece(this.tetrimo);
		this.socketMe.emit('game/terrain', {
			terrain: this.terrain.terrain,
			score: this.score,
		});
		this.terrain.delPiece(this.tetrimo);
	}

	sendPiece(): void {
		this.socketMe.emit('game/pieces', {currentPiece: this.tetrimo.get(), nextPiece: this.nextTetrimo.get()})
	}

	fallPiece(): void {
		if (!this.isStart) return ;
		if (this.terrain.isOnFloor(this.tetrimo)) { // Piece is on the floor
			this.terrain.putPiece(this.tetrimo);
			this.score += this.terrain.delFullLine();
			this.tetrimo.newPiece();
			this.nextTetrimo.newPiece();
			this.sendPiece();
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