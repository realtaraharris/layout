'use strict';

const Layout = require('../components');

class Root extends Layout {
  size(renderContext, props, childBox) {
    this.box.width = childBox.width;
    this.box.height = childBox.height;

    // no need to return anything here because the root node has no parent
  }

  position(
    renderContext,
    {align, width, height},
    updatedParentPosition,
    childCount
  ) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    return Array(childCount).fill(Object.assign({}, updatedParentPosition));
  }

  render(renderContext, {color}) {
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

module.exports = Root;
