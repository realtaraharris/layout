'use strict';

class Layout {
  constructor() {
    this.box = {x: 0, y: 0, width: 0, height: 0};

    this.intersect = this.intersect.bind(this);
  }

  intersect({clientX, clientY, deltaX, deltaY}) {
    const {box} = this;
    if (
      clientX >= box.x &&
      clientX <= box.x + box.width &&
      clientY >= box.y &&
      clientY <= box.y + box.height
    ) {
      return {
        hit: true,
        descend: true,
        box,
        event: {clientX, clientY, deltaX, deltaY}
      };
    }
    return {
      hit: false,
      descend: true
    };
  }

  sizing() {
    return 'shrink';
  }
}

module.exports = Layout;

/**
 * supplies a list of line segments + a way of finding intersections
 */
// class Grid extends Layout {
//   size () {}
//   position () {}
//   render: () {}
// }
