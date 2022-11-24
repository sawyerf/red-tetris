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

	endGame(): void {
		this.terrain = this.terrain.map((line) => line.map((block) => {
			if (block) return 8;
			return 0;
		}));
	}

	addMalus(malus: number) {
		for (let index:number = 0; index < malus; index++) {
			const newLine = new Array(this.sizeColumn);

			newLine.fill(8);
			this.terrain.splice(0, 1);
			this.terrain.push(newLine);
		}
	}

	delMalus(minus: number) {
		for (let index = 0; index < minus; index++) {
			if (this.terrain[this.sizeRow - 1].every((block) => block == 8)) {
				let newRow = new Array(this.sizeColumn);
				newRow.fill(0);
				this.terrain.splice(this.sizeRow - 1, 1);
				this.terrain.unshift(newRow);
			}
		}
	}

	delFullLine(): number {
		let lenRow: number = this.terrain.length;
		let score: number = 0;

		for (let indexRow = lenRow - 1; indexRow >= 0; indexRow--) {
			if (this.terrain[indexRow].every((block) => block && block != 8)) {
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

	putShadow(tetrimo: Tetrimino): void {
		const shadow: Tetrimino = tetrimo.dup();
		while (1) {
			if (this.isOnFloor(shadow)) {
				let piece: number[][] = shadow.get();
				let lenRow: number = piece.length;
		
				for (let indexRow = 0; indexRow < lenRow; indexRow++) {
					let lenColumn: number = piece[indexRow].length;
					for (let indexColumn = 0; indexColumn < lenColumn; indexColumn++) {
						if (piece[indexRow][indexColumn]) {
							this.terrain[shadow.y + indexRow][shadow.x + indexColumn] = (shadow.indexPiece + 1) * -1;
						}
					}
				}		
				return ;
			}
			shadow.fall();
		}
	}

	delShadow(): void {
		let lenRow: number = this.terrain.length;
		
		for (let indexRow = 0; indexRow < lenRow; indexRow++) {
			let lenColumn: number = this.terrain[indexRow].length;
			for (let indexColumn = 0; indexColumn < lenColumn; indexColumn++) {
				if (this.terrain[indexRow][indexColumn] < 0) {
					this.terrain[indexRow][indexColumn] = 0;
				}
			}
		}		
	}
}

export default Terrain;