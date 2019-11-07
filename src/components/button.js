'use strict';

const Layout = require('../components');
const {modes} = require('../layout');

class Button extends Layout {
  getLayoutModes() {
    return {
      sizeMode: modes.CHILDREN, // size depends entirely on children
      positionMode: modes.PARENTS // position depends entirely on parents
    };
  }

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
