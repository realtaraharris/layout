'use strict';

class Layout {
  constructor() {
    this.box = {x: 0, y: 0, width: 0, height: 0};

    this.intersect = this.intersect.bind(this);
  }

  intersect(x, y) {
    const {box} = this;
    if (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      return {
        hit: true,
        descend: true
      };
    }
    return {
      hit: false,
      descend: true
    };
  }
}

class Button extends Layout {
  size(renderContext, props, childBox) {
    this.box.width = childBox.width;
    this.box.height = childBox.height;
    return childBox; // sends a child box up
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    return [updatedParentPosition];
  }

  render() {}

  intersect(x, y) {
    const {box} = this;
    if (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      return {
        hit: true,
        descend: false
      };
    }
    return {
      hit: false,
      descend: false
    };
  }
}

module.exports = {
  Layout,
  Button
  //, Offset, Grid
};

/**
 * given an existing line + offset vector, returns an offset line
 */
// class Offset extends Layout {
//   size () {}
//   position () {}
//   render: () {}
// }

/**
 * supplies a list of line segments + a way of finding intersections
 */
// class Grid extends Layout {
//   size () {}
//   position () {}
//   render: () {}
// }
