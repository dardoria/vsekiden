"use strict";

import "paper";

function randomRange(min=0, max=1) {
  return Math.random() * (max - min) + min;
}


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

class App {
  constructor(rows, columns, rowHeight, columnWidth, rowGutter, columnGutter) {
    this.columnWidth = columnWidth;
    this.rowHeight = rowHeight;
    this.columnGutter = columnGutter;
    this.rowGutter = rowGutter;

    this.grid = this.makeGrid(rows, columns);
    this.circles = this.makeCircles(rows, columns);
    paper.view.onFrame = this.update.bind(this);
  }

  makeGrid(rows, columns) {
    const grid = [];
    for (let i =0; i < columns; i++) {
      for (let j =0; j < rows; j++) {
        grid.push(
          new paper.Rectangle({
            point: [(i * this.columnWidth) + this.columnGutter, (j * this.rowHeight) + this.rowGutter],
            size: [this.columnWidth, this.rowHeight]
          })
        );
      }
    }
    return grid;
  }

  makeCircles(rows, columns) {
    const circles = new Array();
    const circle1 = new Circle({
      center: [(rows / 2) * this.columnWidth, (columns / 2) * this.rowHeight],
      radius: 80,
      strokeColor: 'white'
    });

    const circle2 = new Circle({
      center: [(rows / 3) * this.columnWidth, (columns / 2) * this.rowHeight],
      radius: 90,
      strokeColor: 'white'
    });
    circles.push(circle1);
    circles.push(circle2)

    return circles;
  }

  insideCircle(cell) {
    let result = 0b0000;
    let fResults = [];

    for (let index = 0; index < this.circles.length; index++) {
      const circle = this.circles[index];
      let [result1, fResults1] = circle.contains(cell);
      result += result1;
      //TODO what to do with fResults?
    }
    return [result, fResults];
  }

  debug() {
    for (let index in this.grid) {
      const cell = new paper.Path.Rectangle(this.grid[index]);
      cell.strokeColor = 'blue';
    }
  }

  getIntersections() {
    for (let index in this.grid) {
      const cell = this.grid[index];
      let [score, fResults] = this.insideCircle(cell);

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


const app = new App(40, 40, 10, 10, 0, 0);
//grid.debug();
app.getIntersections();
