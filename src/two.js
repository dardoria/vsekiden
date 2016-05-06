"use strict";

import "paper";

function randomRange(min=0, max=1) {
  return Math.random() * (max - min) + min;
}

class Circle extends paper.Group {
  constructor(drawOptions) {
    super(drawOptions);

    this.center = drawOptions.center;
    this.radius = drawOptions.radius;

    this.shape = new paper.Path.Circle(drawOptions);
  }

  update(event) {
    const index = Math.round(randomRange(0, this.shape.segments.length-1));
    const segment = this.shape.segments[index];

    const expandInX = this.radius + randomRange(0, this.radius * 5);
    const expandInY = this.radius + randomRange(0, this.radius * 5);
    const expandOutX = this.radius - randomRange(0, this.radius * 5);
    const expandOutY = this.radius - randomRange(0, this.radius * 5);

    switch (index) {
    case 0:
      segment.handleIn.x = expandOutX;
      segment.handleIn.y = expandInY;
      break;
    case 1:
      segment.handleIn.x = expandOutX;
      segment.handleIn.y = expandOutY;
      break;
    case 2:
      segment.handleIn.x = expandInX;
      segment.handleIn.y = expandOutY;
      break;
    case 3:
      segment.handleIn.x = expandInX;
      segment.handleIn.y = expandInY;
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
          new Circle({
            center: [(i * this.cellWidth), (j * this.cellHeight)],
            radius: randomRange(0, this.cellWidth/2),
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
