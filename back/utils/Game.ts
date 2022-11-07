import { threadId } from 'worker_threads';
import Terrain from './Terrain';
import Tetrimino from './Tetrimino';
import type { BroadcastOperator, Socket } from 'socket.io';
import { cp } from 'fs';
import { TokenPayload } from '../socket';
import { v4 } from 'uuid';

class Game {
	uid: string;
	terrain: Terrain = new Terrain(20, 10);
	tetrimo: Tetrimino = new Tetrimino(0);
	nextTetrimo: Tetrimino = new Tetrimino(0);
	isStart: boolean = false;
	score: number = 0;
	infoPlayer: TokenPayload;
	intervalId: NodeJS.Timer|undefined;
	// Socket
	socket: BroadcastOperator<any, any>;
	socketMe: Socket;
	isAdmin: boolean;

	constructor(socket: BroadcastOperator<any, any>, socketMe: Socket, infoPlayer: TokenPayload, isAdmin: boolean) {
		this.uid = v4();
		this.socket = socket;
		this.socketMe = socketMe;
		this.infoPlayer = infoPlayer;
		this.isAdmin = isAdmin;
	}

	startGame(seed: number): void {
		this.terrain = new Terrain(20, 10);
		this.tetrimo = new Tetrimino(seed);
		this.nextTetrimo = new Tetrimino(this.tetrimo.seed);
		this.score = 0;
		clearInterval(this.intervalId);
		this.isStart = true;
		this.intervalId = setInterval(() => { this.fallPiece() }, 700);
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
			this.score += this.terrain.delFullLine();
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