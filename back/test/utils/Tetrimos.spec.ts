import Tetrimino from "../../utils/Tetrimino";

describe('Tetrimos Test', () => {
	test('Generete new Tetrimino', () => {
		const currentTetrimo = new Tetrimino(123);
		const nextTetrimo = new Tetrimino(currentTetrimo.seed);
		
		currentTetrimo.newPiece();
		expect(currentTetrimo.indexPiece).toBe(nextTetrimo.indexPiece);
		currentTetrimo.newPiece();
		nextTetrimo.newPiece()
		expect(currentTetrimo.indexPiece).toBe(nextTetrimo.indexPiece);
	})
})