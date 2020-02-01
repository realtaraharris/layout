'use strict';

class Component {
  constructor(props, childCount) {
    this.props = props;
    this.box = {x: 0, y: 0, width: 0, height: 0};
    this.childBoxes = [];
    for (let i = 0; i < childCount; i++) {
      this.childBoxes.push({x: 0, y: 0, width: 0, height: 0});
    }

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

  sizingVertical() {
    return 'shrink';
  }

  sizingHorizontal() {
    return 'shrink';
  }
}

module.exports = Component;

/**
 * supplies a list of line segments + a way of finding intersections
 */
// class Grid extends Component {
//   size () {}
//   position () {}
//   render: () {}
// }
