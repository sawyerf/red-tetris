import Tetrimino from './Tetrimino';

class Terrain {
	sizeColumn: number = 0;
	sizeRow: number = 0;
	terrain: number[][] = this.createTerrain(this.sizeColumn, this.sizeRow);

	constructor(sizeRow: number, sizeColumn: number) {
		this.sizeColumn = sizeColumn;
		this.sizeRow = sizeRow;
		this.terrain = this.createTerrain(this.sizeColumn, this.sizeRow);
	}

	createTerrain(column: number, row: number): number[][] {
		let terrain: number[][] = new Array(row);
		row--;
		for (; row >= 0; row--) {
			terrain[row] = new Array(column);
			terrain[row].fill(0);
		}
		return terrain;
	}

	delFullLine(): number {
		let lenRow: number = this.terrain.length;
		let score: number = 0;

		for (let indexRow = lenRow - 1; indexRow >= 0; indexRow--) {
			if (this.terrain[indexRow].every((block) => block)) {
				let newRow = new Array(this.sizeColumn);
				score++;
				newRow.fill(0);
				this.terrain.unshift(newRow);
				this.terrain.splice(indexRow + 1, 1);
				indexRow++;
			}
		}
		return score;
	}

	isPossible(tetrimo: Tetrimino): boolean {
		let piece: number[][] = tetrimo.get();
		let lenRow: number = piece.length;

		for (let indexRow = 0; indexRow < lenRow; indexRow++) {
			let lenColumn: number = piece[indexRow].length;
			for (let indexColumn = 0; indexColumn < lenColumn; indexColumn++) {
				if (piece[indexRow][indexColumn] &&
					(
						tetrimo.y + indexRow >= this.sizeRow ||
						tetrimo.x + indexColumn < 0 ||
						tetrimo.x + indexColumn >= this.sizeColumn ||
						this.terrain[tetrimo.y + indexRow][tetrimo.x + indexColumn]
					)
				) {
					return false;
				}
			}
		}
		return true;
	}

	isOnFloor(tetrimo: Tetrimino): boolean {
		let piece: number[][] = tetrimo.get();
		let lenRow: number = piece.length;

		for (let indexRow = 0; indexRow < lenRow; indexRow++) {
			let lenColumn: number = piece[indexRow].length;
			for (let indexColumn = 0; indexColumn < lenColumn; indexColumn++) {
				if (piece[indexRow][indexColumn] &&
					(tetrimo.y + indexRow >= this.sizeRow - 1 || this.terrain[tetrimo.y + indexRow + 1][tetrimo.x + indexColumn])) {
					return true;
				}
			}
		}
		return false;
	}

	delPiece(tetrimo: Tetrimino): void {
		let piece: number[][] = tetrimo.get();
		let lenRow: number = piece.length;

		for (let indexRow = 0; indexRow < lenRow; indexRow++) {
			let lenColumn: number = piece[indexRow].length;
			for (let indexColumn = 0; indexColumn < lenColumn; indexColumn++) {
				if (piece[indexRow][indexColumn]) {
					this.terrain[tetrimo.y + indexRow][tetrimo.x + indexColumn] = 0;
				}
			}
		}
	}

	putPiece(tetrimo: Tetrimino): void {
		let piece: number[][] = tetrimo.get();
		let lenRow: number = piece.length;

		for (let indexRow = 0; indexRow < lenRow; indexRow++) {
			let lenColumn: number = piece[indexRow].length;
			for (let indexColumn = 0; indexColumn < lenColumn; indexColumn++) {
				if (piece[indexRow][indexColumn]) {
					this.terrain[tetrimo.y + indexRow][tetrimo.x + indexColumn] = tetrimo.indexPiece + 1;
				}
			}
		}
	}
}

export default Terrain;