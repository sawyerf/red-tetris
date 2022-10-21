import { Component, OnInit } from '@angular/core';
import * as pieces from './tetrimos.json';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  terrain: number[][] = this.createTerrain(10, 20);
  piece: Tetrimino = new Tetrimino(0);

  constructor() {
  }

  ngOnInit(): void {
  }

  createTerrain(column: number, row: number): number[][] {
    let terrain: number[][] = new Array(row);
    row--;
    for (; row >= 0; row--) { 
      terrain[row] = new Array(column);
    }
    terrain[1][5] = 1
    console.log(terrain);
    return terrain;
  }
}

class Tetrimino {
  x: number = 0;
  y: number = 0;
  indexPiece: number;
  rotation: number = 0;

  rotate():void {
    this.rotation++;
    this.rotation = this.rotation % pieces[this.indexPiece].rotation.length;
  }

  fall(): void {
    this.y += 1;
  }

  constructor(piece: number) {
    this.indexPiece = piece;
  }
}