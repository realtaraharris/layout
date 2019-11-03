'use strict';

const Layout = require('../components');

class Box extends Layout {
  serialize() {
    return {
      box: Object.assign({}, this.box),
      positionInfo: Object.assign({}, this.positionInfo)
    };
  }
  deserialize(state) {
    this.box = state.box;
    this.positionInfo = state.positionInfo;
  }

  getLayoutModes() {
    return {
      sizeMode: 'parent', // size depends entirely on parent
      positionMode: 'parent' // position depends entirely on parent
    };
  }

  size(renderContext, {width, height}) {
    this.box.width = width;
    this.box.height = height;
    // return this.box;
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // return [updatedParentPosition];
    this.positionInfo = [updatedParentPosition];
  }

  render(renderContext) {
    renderContext.strokeStyle = 'red';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }
}

module.exports = Box;
