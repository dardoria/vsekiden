"use strict"

import "paper";

function randomRange(min=0, max=1) {
  return Math.random() * (max - min) + min;
}

class Rectangle extends paper.Group {
  constructor(drawOptions) {
    super(drawOptions);

    this.startX = drawOptions.point[0];
    this.startY = drawOptions.point[1];

    this.shape = new paper.Path.Rectangle(drawOptions);
  }

  update(event) {
      const index = Math.round(randomRange(0, 3));
      const segment = this.shape.segments[index];
      let newX = 0;
      let newY = 0;
      if (index < 2) {
        newX = this.startX - randomRange(0, 60);
      } else {
        newX = this.startX + randomRange(0, 60);
      }

      if (index === 0 || index == 3) {
        newY = this.startY - randomRange(0, 60);
      } else {
        newY = this.startY + randomRange(0, 60);
      }

      segment.point.x = newX;
      segment.point.y = newY;
    }
}

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
          new Rectangle({
            point: [(i * this.cellWidth) + this.columnGutter, (j * this.cellHeight) + this.rowGutter],
            size: [randomRange(0, this.cellWidth), randomRange(0, this.cellWidth)],
            strokeColor: 'black'
          })
        );
      }
    }

    paper.view.onFrame = this.update.bind(this);
  }



  update(event) {
    for (let index in this.items) {
      const rectangle = this.items[index];
      rectangle.update(event);
    }
  }
}


const grid = new Grid(8, 8);
paper.view.translate(100,100);
