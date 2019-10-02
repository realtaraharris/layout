'use strict';

const Layout = require('../components');

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
        descend: false,
        box
      };
    }
    return {
      hit: false,
      descend: false
    };
  }
}

module.exports = Button;
