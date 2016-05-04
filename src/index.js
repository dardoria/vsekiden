"use strict"

import "paper";

class Grid {

  constructor(rows, columns) {
    this.cellWidth = 80;
    this.cellHeight = 80;
    this.columnGutter = 5;
    this.rowGutter = 5;

    this.items = [];

    for (let i =0; i < columns; i++) {
      for (let j =0; j < rows; j++) {
        this.items.push(
          new paper.Path.Rectangle({
            point: [(i * this.cellWidth) + this.columnGutter, (j * this.cellHeight) + this.rowGutter],
            size: [this.getSize(this.cellWidth), this.getSize(this.cellWidth)],
            strokeColor: 'black'
          })
        );
      }
    }

    //paper.view.onFrame = this.update.bind(this);
  }

  getSize(max, min=0) {
    return Math.random() * (max - min) + min;
  }

  update(event) {
    for (let index in this.items) {
      const shape = this.items[index];
      const segment = shape.segments[event.count % 3];
      if (event.count % 2 == 0) {
        segment.point.x -= this.getSize(40);
      } else {
        segment.point.x += this.getSize(40);
      }
    }
  }
}


const grid = new Grid(8, 8);
