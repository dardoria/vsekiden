"use strict";

import "paper";

function randomRange(min=0, max=1) {
  return Math.random() * (max - min) + min;
}


// |---1---|
// |       |
// 0       2
// |       |
// ----3----
const segments = {
  1: ['left', 'bottom'],
  2: ['right', 'bottom'],
  3: ['left', 'right'],
  4: ['top', 'right'],
  6: ['top', 'bottom'],
  7: ['left', 'top'],
  8: ['left', 'top'],
  9: ['top', 'bottom'],
  11: ['top', 'right'],
  12: ['left', 'right'],
  13: ['right', 'bottom'],
  14: ['left', 'bottom']
};

const pointsMap = {
  'left': ['topLeft', 'bottomLeft'],
  'top': ['topLeft', 'topRight'],
  'right': ['topRight', 'bottomRight'],
  'bottom': ['bottomLeft', 'bottomRight']
};

function getPoint(rect, index) {
  let points = pointsMap[index];
  if (['left', 'right'].indexOf(index) > -1) {
    return new paper.Point(
      rect[points[0]].x,
      rect[points[0]].y + ((rect[points[1]].y - rect[points[0]].y) / 2)
    );
  } else {
    return new paper.Point(
      rect[points[0]].x + ((rect[points[1]].x - rect[points[0]].x) / 2),
      rect[points[0]].y
    );
  }
};

class Circle extends paper.Group {
  constructor(drawOptions) {
    super(drawOptions);

    this.circle = new paper.Path.Circle(drawOptions);
    this.center = drawOptions.center;
    this.radius = drawOptions.radius;
  }

  contains(rectangle) {
    let result = 0b0000;
    let fResults = [];

    for (let [getter, mask] of [['bottomLeft', 0b0001],
                                ['bottomRight', 0b0010],
                                ['topRight', 0b0100],
                                ['topLeft', 0b1000]]) {

      const point = rectangle[getter];

      const f = Math.pow(this.radius, 2) / (
        (Math.pow((point.x - this.center[0]), 2)) +
        (Math.pow((point.y - this.center[1]), 2)));

      if (f > 1) {
        result = result | mask;
      }
      fResults.push(f);
    }
    return [result, fResults];
  }

  update(event) {

  }
}

class Grid {

  constructor(rows, columns) {
    this.cellWidth = 20;
    this.cellHeight = 20;
    this.columnGutter = 0;
    this.rowGutter = 0;

    this.cells = [];

    for (let i =0; i < columns; i++) {
      for (let j =0; j < rows; j++) {
        this.cells.push(
          new paper.Rectangle({
            point: [(i * this.cellWidth) + this.columnGutter, (j * this.cellHeight) + this.rowGutter],
            size: [this.cellWidth, this.cellHeight]
          })
        );
      }
    }

    this.circle = new Circle({
      center: [(rows / 2) * this.cellWidth, (columns / 2) * this.cellHeight],
      radius: 50,
      strokeColor: 'black'
    });

    paper.view.onFrame = this.update.bind(this);
  }

  debug() {
    for (let index in this.cells) {
      const cell = new paper.Path.Rectangle(this.cells[index]);
      cell.strokeColor = 'blue';
    }
  }

  getIntersections() {
    for (let index in this.cells) {
      const cell = this.cells[index];
      let [score, fResults] = this.circle.contains(cell);

      //TODO skip 10 and 5 for now
      if (score > 0 && score < 15 && score != 10 && score != 5) {
        let segment = segments[score];
        let fromPoint = getPoint(cell, segment[0]);
        let toPoint = getPoint(cell, segment[1]);

        new paper.Path.Line({
          from: fromPoint,
          to: toPoint,
          strokeColor: 'black'
        });
      }
    }
  }

  update(event) {
    if (event.count % 10 === 0) {
      return;
    }

    //this.getIntersections();
  }
}


const grid = new Grid(32, 32);
grid.debug();
grid.getIntersections();
