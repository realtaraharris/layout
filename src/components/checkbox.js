'use strict';

const Layout = require('../components');
const {roundRect} = require('../draw');

class Checkbox extends Layout {
  size() {
    const newBox = {
      x: 0,
      y: 0,
      width: 40,
      height: 40
    };
    this.box = newBox;

    return Object.assign({}, newBox);
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;
  }

  render(renderContext, {color, checked}) {
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
