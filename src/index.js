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


function getPoint(rect, index, fResults) {
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

function getPointLerp(cell, index, fResults) {
  let points = pointsMap[index];
  switch (index) {
    case 'right':
      return new paper.Point(
        cell.topRight.x,
        cell.topRight.y + ((cell.bottomRight.y - cell.topRight.y) * ((1 - fResults[2]) / (fResults[1] - fResults[2])))
      );
      break;
    case 'left':
      return new paper.Point(
        cell.topLeft.x,
        cell.topLeft.y + ((cell.bottomLeft.y - cell.topLeft.y) * ((1 - fResults[3]) / (fResults[0] - fResults[3])))
      );
      break;
    case 'top':
      return new paper.Point(
        cell.topLeft.x + ((cell.topRight.x - cell.topLeft.x) * ((1 - fResults[3]) / (fResults[2] - fResults[3]))),
        cell.topLeft.y
      );
      break;
    case 'bottom':
      //      (x - x0) / (x1 - x0);
      return new paper.Point(
        cell.bottomRight.x - ((cell.bottomRight.x - cell.bottomLeft.x) * ((1 - fResults[1]) / (fResults[0] - fResults[1]))),
        cell.bottomLeft.y
      );
      break;
  }
}

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
      center: [((rows / 2) * this.columnWidth) - 123, ((columns / 3) * this.rowHeight) - 54],
      radius: 100,
      strokeColor: 'grey'
    });

    const circle2 = new Circle({
      center: [(rows / 4) * this.columnWidth, (columns / 3) * this.rowHeight],
      radius: 120,
      strokeColor: 'grey'
    });
    circles.push(circle1);
    circles.push(circle2)

    return circles;
  }

  insideCircle(cell) {
    let result = 0b0000;
    let fResults = [0, 0, 0, 0];

    for (let index = 0; index < this.circles.length; index++) {
      const circle = this.circles[index];
      let [result1, fResults1] = circle.contains(cell);
      result = result | result1;
      fResults = fResults1.map((res, idx) => Math.max(res, fResults[idx]));
    }
    return [result, fResults];
  }

  debug() {
    for (let index in this.grid) {
      const cell = new paper.Path.Rectangle(this.grid[index]);
      cell.strokeColor = 'grey';
    }
  }

  getIntersections() {
    for (let index in this.grid) {
      const cell = this.grid[index];
      let [score, fResults] = this.insideCircle(cell);

      // if (score > 0) {
      //   let segment_label = new PointText(cell.topLeft + 40);
      //   segment_label.content = score;
      //   segment_label.strokeColor = 'red';
      // }

      //TODO skip 10 and 5 for now
      if (score > 0 && score < 15 && score != 10 && score != 5) {
        let segment = segments[score];

        let color = 'red'

        // let text = new PointText(cell.bottomLeft);
        // text.content = fResults[0].toFixed(2);

        // let text1 = new PointText(cell.bottomRight);
        // text1.content = fResults[1].toFixed(2)

        // let text2 = new PointText(cell.topRight);
        // text2.content = fResults[2].toFixed(2);

        // let text3 = new PointText(cell.topLeft);
        // text3.content = fResults[3].toFixed(2);

        let fromPointLerp = getPointLerp(cell, segment[0], fResults);
        let toPointLerp = getPointLerp(cell, segment[1], fResults);

        new paper.Path.Line({
          from: fromPointLerp,
          to: toPointLerp,
          strokeColor: color
        });

        // let fromPoint = getPoint(cell, segment[0], fResults);
        // let toPoint = getPoint(cell, segment[1], fResults);

        // new paper.Path.Line({
        //   from: fromPoint,
        //   to: toPoint,
        //   strokeColor: 'red'
        // });
        // new paper.Path.Circle({
        //   center: fromPoint,
        //   radius: 3,
        //   strokeColor: color
        // });

        // new paper.Path.Circle({
        //   center: toPoint,
        //   radius: 3,
        //   strokeColor: color,
        //   fillColor: color
        // });
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


const app = new App(100, 100, 10, 10, 0, 0);
app.debug();
app.getIntersections();
