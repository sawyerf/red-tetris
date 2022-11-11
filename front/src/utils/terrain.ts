export const createTerrain = (column: number, row: number): number[][] => {
	const terrain: number[][] = new Array(row);

	row--;
	for (; row >= 0; row--) {
		terrain[row] = new Array(column);
		terrain[row].fill(0);
	}
	return terrain;
}
