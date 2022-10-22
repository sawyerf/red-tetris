import { Component, OnInit } from '@angular/core';
import * as pieces from './tetrimos.json';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  terrain: Terrain = new Terrain();
  tetrimo: Tetrimino = new Tetrimino();
  intervalId: NodeJS.Timer = setInterval(() => {}, 1000);

  constructor() {
  }

  startGame(): void {
    this.terrain = new Terrain();
    this.tetrimo = new Tetrimino();
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => { this.fallPiece(this.tetrimo) }, 750);
  }

  fallPiece(tetrimo: Tetrimino): void {
    this.terrain.delPiece(tetrimo);
    if (this.terrain.isOnFloor(tetrimo)) { // Piece is on the floor
      this.terrain.putPiece(tetrimo);
      this.terrain.delFullLine();
      this.tetrimo = new Tetrimino();
      if (this.terrain.isPossible(this.tetrimo) == false) {
        clearInterval(this.intervalId);
      }
      return ;
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

  ngOnInit(): void {
  }
}

class Terrain {
  sizeColumn: number = 10;
  sizeRow: number = 20;
  terrain: number[][] = this.createTerrain(this.sizeColumn, this.sizeRow);

  createTerrain(column: number, row: number): number[][] {
    let terrain: number[][] = new Array(row);
    row--;
    for (; row >= 0; row--) { 
      terrain[row] = new Array(column);
      terrain[row].fill(0);
    }
    return terrain;
  }

  delFullLine(): void {
    let lenRow: number = this.terrain.length;
  
    for (let indexRow = lenRow -1; indexRow >= 0; indexRow--) {
      console.log(this.terrain[indexRow].every((block) => block == 1));
      if (this.terrain[indexRow].every((block) => block)) {
        console.log("full line ", indexRow, this.terrain[indexRow]);
        let newRow = new Array(this.sizeColumn);
        newRow.fill(0);
        this.terrain.unshift(newRow);
        this.terrain.splice(indexRow + 1, 1);
        indexRow++;
      }
    }
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
    let len: number = piece.length;

    for (let indexRow = 0; indexRow < len; indexRow++) {
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
    let len: number = piece.length;

    for (let indexRow = 0; indexRow < len; indexRow++) {
      let lenColumn: number = piece[indexRow].length;
      for (let indexColumn = 0; indexColumn < len; indexColumn++) {
        if (piece[indexRow][indexColumn]) {
          this.terrain[tetrimo.y + indexRow][tetrimo.x + indexColumn] = piece[indexRow][indexColumn];
        }
      }
    }
  }

  constructor() {
  }
}

class Tetrimino {
  x: number = 4;
  y: number = 0;
  indexPiece: number;
  rotation: number = 0;

  get(): number[][] {
    return pieces[this.indexPiece].rotation[this.rotation];
  }

  rotate():void {
    this.rotation++;
    this.rotation = this.rotation % pieces[this.indexPiece].rotation.length;
  }

  deRotate():void {
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
    this.indexPiece = Math.floor(Math.random() * 3);
  }
}