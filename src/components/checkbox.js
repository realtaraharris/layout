'use strict';

const Layout = require('../components');
const {roundRect} = require('../draw');

class Checkbox extends Layout {
  size() {
    this.box = {
      x: 0,
      y: 0,
      width: 40,
      height: 40
    };
  }

  position(props, {parent, childPosition}) {
    const parentBox = parent.instance.childBoxes[childPosition];
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
  }

  render({color, checked}, {renderContext}) {
    renderContext.fillStyle = color;

    roundRect(
      renderContext,
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height,
      {
        topLeft: 5,
        topRight: 5,
        bottomLeft: 5,
        bottomRight: 5
      }
    );
    renderContext.fill();

    if (checked) {
      renderContext.fillStyle = 'black';
      renderContext.fillRect(this.box.x + 10, this.box.y + 10, 20, 20);
    }
  }
}

module.exports = Checkbox;
