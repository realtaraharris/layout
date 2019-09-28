'use strict';

const {Layout} = require('../components');

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

module.exports = {Button};
