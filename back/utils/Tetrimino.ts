import pieces from './tetriminos.json'

class Tetrimino {
	x: number = 4;
	y: number = 0;
	indexPiece: number = 0;
	rotation: number = 0;
	seed: number;
	
	constructor(seed: number) {
		this.seed = this.randomSeed(seed);
		this.indexPiece = Math.floor(this.seed * pieces.length);
		console.log('Piece:', this.indexPiece);
	}
	
	randomSeed(seed: number) {
		seed = Math.sin(seed) * 10000;
		return seed - Math.floor(seed);
	};

	newPiece() {
		this.seed = this.randomSeed(this.seed);
		this.indexPiece = Math.floor(this.seed * pieces.length);
		this.x = 4;
		this.y = 0;
		this.rotation = 0;
		console.log('Piece:', this.indexPiece);
	}

	get(): number[][] {
		return pieces[this.indexPiece].rotation[this.rotation].map((item) => item.map((block) => {
				return block * (this.indexPiece + 1);
			})
		);
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
}

export default Tetrimino;