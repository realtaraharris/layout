'use strict';

const Layout = require('../components');
const {roundRect} = require('../draw');

class Rectangle extends Layout {
  size(renderContext, props, childBox) {
    this.box = Object.assign({}, childBox);

    return {
      x: this.box.x,
      y: this.box.y,
      width: this.box.width,
      height: this.box.height
    };
  }

  position(
    renderContext, // eslint-disable-line no-unused-vars
    props, // eslint-disable-line no-unused-vars
    updatedParentPosition,
    childCount
  ) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // TODO: this should not accept multiple children!
    return Array(childCount).fill(
      Object.assign(
        {},
        {
          x: updatedParentPosition.x,
          y: updatedParentPosition.y
        }
      )
    );
  }

  render(renderContext, {color, topLeft, topRight, bottomLeft, bottomRight}) {
    renderContext.fillStyle = color;

    roundRect(
      renderContext,
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height,
      {
        topLeft,
        topRight,
        bottomLeft,
        bottomRight
      }
    );
    renderContext.fill();
  }
}

module.exports = Rectangle;
