import pieces from './tetriminos.json'

class Tetrimino {
	x: number = 4;
	y: number = 0;
	indexPiece: number;
	rotation: number = 0;

	get(): number[][] {
		return pieces[this.indexPiece].rotation[this.rotation];
	}

	rotate(): void {
		this.rotation++;
		this.rotation = this.rotation % pieces[this.indexPiece].rotation.length;
	}

	rotateVerticaly(): void {
		this.rotation += 2;
		this.rotation = this.rotation % pieces[this.indexPiece].rotation.length;
	}

	deRotate(): void {
		this.rotation += pieces[this.indexPiece].rotation.length - 1;
		this.rotation = this.rotation % pieces[this.indexPiece].rotation.length;
	}

	fall(): void {
		this.y += 1;
	}

	right(): void {
		this.x += 1;
	}

	left(): void {
		this.x -= 1;
	}

	constructor() {
		this.indexPiece = Math.floor(Math.random() * pieces.length);
		console.log(this.indexPiece);
	}
}

export default Tetrimino;