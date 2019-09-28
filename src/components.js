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

module.exports = Layout;

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
