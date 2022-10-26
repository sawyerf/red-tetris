import { threadId } from 'worker_threads';
import Terrain from './Terrain';
import Tetrimino from './Tetrimino';
import type { Socket } from 'socket.io';

class Game {
	terrain: Terrain = new Terrain(20, 10);
	tetrimo: Tetrimino = new Tetrimino();
	intervalId: NodeJS.Timer = setInterval(() => { }, 1000);
	score: number = 0;
	isStart: boolean = false;
	socket: Socket;

	constructor(socket: Socket) {
		this.socket = socket;
	}

	startGame(): void {
		this.terrain = new Terrain(20, 10);
		this.tetrimo = new Tetrimino();
		this.score = 0;
		clearInterval(this.intervalId);
		this.isStart = true;
		this.intervalId = setInterval(() => { this.fallPiece() }, 750);
		this.sendTerrain();
	}

	sendTerrain(): void {
		this.terrain.putPiece(this.tetrimo);
		this.socket.emit('terrain', {terrain: this.terrain.terrain});
		this.terrain.delPiece(this.tetrimo);
	}

	fallPiece(): void {
		if (this.terrain.isOnFloor(this.tetrimo)) { // Piece is on the floor
			this.terrain.putPiece(this.tetrimo);
			this.score += this.terrain.delFullLine();
			this.tetrimo = new Tetrimino();
			if (this.terrain.isPossible(this.tetrimo) == false) {
				this.isStart = false;
				clearInterval(this.intervalId);
			} else {
				this.sendTerrain();
			}
			return;
		}
		this.tetrimo.fall();
		this.sendTerrain();
	}

	rightPiece(): void {
		this.tetrimo.right()
		if (this.terrain.isPossible(this.tetrimo)) return this.sendTerrain();
		this.tetrimo.left();
	}

	leftPiece(): void {
		this.tetrimo.left()
		if (this.terrain.isPossible(this.tetrimo)) return this.sendTerrain();
		this.tetrimo.right();
	}

	rotatePiece(): void {
		this.tetrimo.rotate()
		if (this.terrain.isPossible(this.tetrimo)) return this.sendTerrain();
		this.tetrimo.deRotate();
	}

	rotateVerticalyPiece(): void {
		this.tetrimo.rotateVerticaly()
		if (this.terrain.isPossible(this.tetrimo)) return this.sendTerrain();
		this.tetrimo.rotateVerticaly();
	}

	ngOnInit(): void {
	}
}

export default Game;