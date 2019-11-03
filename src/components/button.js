'use strict';

const Layout = require('../components');
const {modes} = require('../layout');

class Button extends Layout {
  serialize() {
    return {
      box: Object.assign({}, this.box),
      parentBox: Object.assign({}, this.parentBox),
      positionInfo: Object.assign({}, this.positionInfo)
    };
  }
  deserialize(state) {
    this.box = state.box;
    this.parentBox = state.parentBox;
    this.positionInfo = state.positionInfo;
  }

  size(renderContext, props, childBox) {
    this.box.width = childBox.width;
    this.box.height = childBox.height;

    this.parentBox = Object.assign({}, childBox);
    // return childBox; // sends a child box up
  }

  getLayoutModes() {
    return {
      sizeMode: modes.CHILDREN, // size depends entirely on children
      positionMode: modes.PARENTS // position depends entirely on parent
    };
  }

  position(renderContext, props, updatedParentPosition) {
    // for (let i = 0; i < component.children.length; i++) {
    //   const child = component.children[i];
    //   const newPos = position[i];

    //   calcBoxPositions(renderContext, child, newPos);
    // }

    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // return [updatedParentPosition];
    this.positionInfo = [updatedParentPosition];
  }

  render() {}

  intersect({clientX, clientY}) {
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
