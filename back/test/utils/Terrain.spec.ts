import Terrain from '../../utils/Terrain';
import Tetrimino from '../../utils/Tetrimino';

const checkZero = (terrain: number[][]): boolean => {
	return terrain.every((line) => line.every((block) => !block))
}

describe('Test Terrain', () => {
	test('Create Terrain', () => {
		const terrain: Terrain = new Terrain(20, 10);

		expect(terrain.terrain.length).toBe(20);
		expect(terrain.terrain[0].length).toBe(10);
	})

	test('Put/Del Piece', () => {
		const terrain: Terrain = new Terrain(20, 10);
		const tetrimo: Tetrimino = new Tetrimino(0, 12);


		terrain.putPiece(tetrimo)
		expect(checkZero(terrain.terrain)).toBe(false);
		terrain.delPiece(tetrimo);
		expect(checkZero(terrain.terrain)).toBe(true);
	})

	test('Del Line', () => {
		const terrain: Terrain = new Terrain(20, 10);
		const tetrimo: Tetrimino = new Tetrimino(0, 12);

		terrain.terrain[0] = terrain.terrain[0].map((block) => 1)
		const score = terrain.delFullLine();
		expect(checkZero(terrain.terrain)).toBe(true);
		expect(score).toBe(1);
	})
})