'use strict';

const Layout = require('../components');

class Offset extends Layout {
  constructor(props) {
    super(props);
  }

  size(renderContext, props, childBox, childCount, cache) {
    return {x: 0, y: 0, width: 0, height: 0};
  }

  position(renderContext, {x, y}, updatedParentPosition) {
    this.box.x = updatedParentPosition.x + x;
    this.box.y = updatedParentPosition.y + y;

    return [{x: this.box.x, y: this.box.y, width: 0, height: 0}];
  }

  render(renderContext, props) {}
}

module.exports = Offset;
