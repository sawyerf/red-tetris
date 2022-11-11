import pieces from './tetriminos.json'

class Tetrimino {
	x: number = 4;
	y: number = 0;
	indexPiece: number = 0;
	rotation: number = 0;
	seed: number;
	sizeColumn: number;
	
	constructor(seed: number, sizeColumn: number) {
		this.seed = this.randomSeed(seed);
		this.indexPiece = Math.floor(this.seed * pieces.length);
		this.sizeColumn = sizeColumn;
		this.x = this.getIndexStart();
	}
	
	randomSeed(seed: number) {
		seed = Math.sin(seed) * 10000;
		return seed - Math.floor(seed);
	};

	getIndexStart() {
		const sizeTetri = this.get()[0].length;

		return Math.floor((this.sizeColumn / 2) - (sizeTetri / 2));
	}

	newPiece(): void {
		this.seed = this.randomSeed(this.seed);
		const newIndexPiece = Math.floor(this.seed * pieces.length);
		if (newIndexPiece == this.indexPiece) return this.newPiece();
		this.indexPiece = newIndexPiece
		this.rotation = 0;
		this.x = this.getIndexStart();
		this.y = 0;
	}

	dup(): Tetrimino {
		const dupTet = new Tetrimino(0, this.sizeColumn);

		dupTet.x = this.x;
		dupTet.y = this.y;
		dupTet.indexPiece = this.indexPiece;
		dupTet.rotation = this.rotation;
		return dupTet;
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