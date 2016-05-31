"use strict";

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
    let segment = this.shape.segments[index];

    let x = randomRange(0, this.shape.size[0]);
    let width = randomRange(2, this.shape.size[0] - x);
    let y = randomRange(0, this.shape.size[1]);
    let height = randomRange(2, this.shape.size[1] - y);

    let shape = this.shape.clone();

    switch(index) {
    case 0:
      shape.insert(
        index+1,
        [segment.point.x, segment.point.y - y],
        [segment.point.x - width, segment.point.y - y],
        [segment.point.x - width, segment.point.y - y - height],
        [segment.point.x, segment.point.y - y - height]
      );
      break;
    case 1:
      shape.insert(
        index+1,
        [segment.point.x + x, segment.point.y],
        [segment.point.x + x, segment.point.y - y],
        [segment.point.x + x + width, segment.point.y - y],
        [segment.point.x + x + width, segment.point.y]
      );
      break;
    case 2:
      shape.insert(
        index+1,
        [segment.point.x, segment.point.y + y],
        [segment.point.x + width, segment.point.y + y],
        [segment.point.x + width, segment.point.y + y + height],
        [segment.point.x, segment.point.y + y + height]
      );
      break;
    case 3:
      shape.insert(
        index+1,
        [segment.point.x - x, segment.point.y],
        [segment.point.x - x, segment.point.y + y],
        [segment.point.x - x - width, segment.point.y + y],
        [segment.point.x - x - width, segment.point.y]
      );
      break;
    }
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
    if (event.count === 20) {
      this.view.onFrame = null;
    }

    for (let index in this.items) {
      const rectangle = this.items[index];
      rectangle.update(event);
    }
  }
}


const grid = new Grid(8, 8);
paper.view.translate(100,100);
