'use strict';

const Layout = require('../components');
const {roundRect} = require('../draw');

class Rectangle extends Layout {
  size(props, {sizing, parentBox}) {
    if (sizing === 'expand') {
      this.box.x = parentBox.x;
      this.box.y = parentBox.y;
      this.box.width = parentBox.width;
      this.box.height = parentBox.height;
    }
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
  }

  render(
    {color, topLeft = 0, topRight = 0, bottomLeft = 0, bottomRight = 0},
    {renderContext}
  ) {
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

  sizing() {
    return 'expand';
  }
}

module.exports = Rectangle;
