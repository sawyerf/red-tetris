import Terrain from './terrain';
import Tetrimino from './tetrimino';

class Room {
	terrain: Terrain = new Terrain(20, 10);
	tetrimo: Tetrimino = new Tetrimino();
	intervalId: NodeJS.Timer = setInterval(() => { }, 1000);
	score: number = 0;
	isStart: boolean = false;

	constructor() {
		document.body.addEventListener('keydown', (event) => {
			console.log(event)
			if (event.key == 'Enter') return this.startGame();
			if (this.isStart) {
				if (event.key == 'ArrowDown') return this.fallPiece(this.tetrimo);
				if (event.key == 'ArrowUp') return this.rotatePiece(this.tetrimo);
				if (event.key == 'ArrowRight') return this.rightPiece(this.tetrimo);
				if (event.key == 'ArrowLeft') return this.leftPiece(this.tetrimo);
				if (event.key == ' ') return this.rotateVerticalyPiece(this.tetrimo);
			}
		});
	}

	startGame(): void {
		this.terrain = new Terrain(20, 10);
		this.tetrimo = new Tetrimino();
		this.score = 0;
		clearInterval(this.intervalId);
		this.isStart = true;
		this.intervalId = setInterval(() => { this.fallPiece(this.tetrimo) }, 750);
	}

	fallPiece(tetrimo: Tetrimino): void {
		this.terrain.delPiece(tetrimo);
		if (this.terrain.isOnFloor(tetrimo)) { // Piece is on the floor
			this.terrain.putPiece(tetrimo);
			this.score += this.terrain.delFullLine();
			this.tetrimo = new Tetrimino();
			if (this.terrain.isPossible(this.tetrimo) == false) {
				this.isStart = false;
				clearInterval(this.intervalId);
			}
			return;
		}
		tetrimo.fall();
		this.terrain.putPiece(tetrimo);
	}

	rightPiece(tetrimo: Tetrimino): void {
		this.terrain.delPiece(tetrimo);
		tetrimo.right()
		if (this.terrain.isPossible(tetrimo)) return this.terrain.putPiece(tetrimo);
		tetrimo.left();
		this.terrain.putPiece(tetrimo);
	}

	leftPiece(tetrimo: Tetrimino): void {
		this.terrain.delPiece(tetrimo);
		tetrimo.left()
		if (this.terrain.isPossible(tetrimo)) return this.terrain.putPiece(tetrimo);
		tetrimo.right();
		this.terrain.putPiece(tetrimo);
	}

	rotatePiece(tetrimo: Tetrimino): void {
		this.terrain.delPiece(tetrimo);
		tetrimo.rotate()
		if (this.terrain.isPossible(tetrimo)) return this.terrain.putPiece(tetrimo);
		tetrimo.deRotate();
		this.terrain.putPiece(tetrimo);
	}

	rotateVerticalyPiece(tetrimo: Tetrimino): void {
		this.terrain.delPiece(tetrimo);
		tetrimo.rotateVerticaly()
		if (this.terrain.isPossible(tetrimo)) return this.terrain.putPiece(tetrimo);
		tetrimo.rotateVerticaly();
		this.terrain.putPiece(tetrimo);
	}

	ngOnInit(): void {
	}
}

export default Room;