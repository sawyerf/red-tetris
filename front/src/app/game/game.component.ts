import { Component, OnInit } from '@angular/core';
import pieces from './tetrimos.json';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  terrain: Terrain = new Terrain(20,10);
  tetrimo: Tetrimino = new Tetrimino();
  intervalId: NodeJS.Timer = setInterval(() => {}, 1000);
  score: number = 0;
  isStart: boolean = false;

  constructor() {
    document.body.addEventListener('keydown', (event) => {
      console.log(event)
      if (event.key == 'Enter') return this.startGame();
      // console.log('isStart ', this.isStart);
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
  
    for (let indexRow = lenRow -1; indexRow >= 0; indexRow--) {
      console.log(this.terrain[indexRow].every((block) => block == 1));
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

  rotateVerticaly():void {
    this.rotation += 2;
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
    this.indexPiece = Math.floor(Math.random() * pieces.length);
    console.log(this.indexPiece);
  }
}