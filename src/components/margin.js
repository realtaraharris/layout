'use strict';

const Layout = require('../components');
const {modes} = require('../layout');

class Margin extends Layout {
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

  getLayoutModes() {
    return {
      sizeMode: modes.SELF_AND_CHILDREN, // size depends entirely on self AND children
      positionMode: modes.PARENTS // position depends entirely on parent
    };
  }

  size(renderContext, {top, right, bottom, left}, childBox) {
    this.box = Object.assign({}, childBox);
    this.parentBox = {
      x: this.box.x,
      y: this.box.y,
      width: this.box.width + left + right,
      height: this.box.height + top + bottom
    };
  }

  position(
    renderContext, // eslint-disable-line no-unused-vars
    {top, right, bottom, left}, // eslint-disable-line no-unused-vars
    updatedParentPosition,
    childCount
  ) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    this.positionInfo = Array(childCount).fill(
      Object.assign(
        {},
        {
          x: updatedParentPosition.x + left,
          y: updatedParentPosition.y + top
        }
      )
    );
  }

  render(renderContext, {top, bottom, left, right, showBoxes = false}) {
    if (!showBoxes) {
      return;
    }

    renderContext.setLineDash([4, 4]);
    renderContext.strokeStyle = 'darkgray';
    renderContext.strokeRect(
      this.box.x + left,
      this.box.y + top,
      this.box.width,
      this.box.height
    );

    renderContext.setLineDash([]);
    renderContext.strokeStyle = 'orange';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width + right + left,
      this.box.height + top + bottom
    );
  }
}

module.exports = Margin;
