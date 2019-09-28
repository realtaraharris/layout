'use strict';

const Layout = require('../components');

class Margin extends Layout {
  size(renderContext, {top, right, bottom, left}, childBox) {
    this.box = Object.assign({}, childBox);

    return {
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

    return Array(childCount).fill(
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
