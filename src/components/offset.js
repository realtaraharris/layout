'use strict';

const Layout = require('../components');

class Offset extends Layout {
  constructor(props) {
    super(props);
  }

  size() {
    return {x: 0, y: 0, width: 0, height: 0};
  }

  position({x, y}, {updatedParentPosition}) {
    this.box.x = updatedParentPosition.x + x;
    this.box.y = updatedParentPosition.y + y;

    return [{x: this.box.x, y: this.box.y, width: 0, height: 0}];
  }

  render() {}
}

module.exports = Offset;
