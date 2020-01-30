'use strict';

const Layout = require('../components');

class Offset extends Layout {
  constructor(props) {
    super(props);
  }

  size() {
    this.box = {x: 0, y: 0, width: 0, height: 0};
  }

  position({x, y}, {parentBox}) {
    this.box.x = parentBox.x + x;
    this.box.y = parentBox.y + y;

    this.childBoxes = [
      {
        x: this.box.x,
        y: this.box.y,
        width: 0,
        height: 0
      }
    ];
  }

  render() {}
}

module.exports = Offset;
