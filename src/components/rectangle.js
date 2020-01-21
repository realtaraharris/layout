'use strict';

const Layout = require('../components');
const {roundRect} = require('../draw');

class Rectangle extends Layout {
  constructor() {
    super();
    this.box = {x: 0, y: 0, width: 20, height: 20};
  }
  size(props, {mode, parent, childPosition}) {
    if (mode === 'expand') {
      const parentBox = parent.instance.childBoxes[childPosition];

      this.box.x = parentBox.x;
      this.box.y = parentBox.y;
      this.box.width = parentBox.width;
      this.box.height = parentBox.height;
    }
  }

  position(props, {parent, childPosition}) {
    const parentBox = parent.instance.childBoxes[childPosition];

    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
  }

  render({color, topLeft, topRight, bottomLeft, bottomRight}, {renderContext}) {
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

  flowMode() {
    return 'expand';
  }
}

module.exports = Rectangle;
