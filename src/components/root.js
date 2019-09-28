'use strict';

const {Layout} = require('../components');

class Root extends Layout {
  // eslint-disable-next-line no-unused-vars
  size(renderContext, {x, y, width, height}, childBox) {
    this.box.width = childBox.width;
    this.box.height = childBox.height;

    // no need to return anything here because the root node has no parent
  }

  position(
    renderContext, // eslint-disable-line no-unused-vars
    {x, y, width, height}, // eslint-disable-line no-unused-vars
    updatedParentPosition,
    childCount
  ) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    return Array(childCount).fill(Object.assign({}, updatedParentPosition));
  }

  // eslint-disable-next-line no-unused-vars
  render(renderContext, {x, y, width, height, color}) {
    renderContext.fillStyle = color;
    renderContext.fillRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }

  intersect() {
    return {
      hit: false,
      descend: true
    };
  }
}

module.exports = {Root};
