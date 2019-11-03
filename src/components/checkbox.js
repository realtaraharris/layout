'use strict';

const Layout = require('../components');
const {roundRect} = require('../draw');
const {modes} = require('../layout');

class Checkbox extends Layout {
  serialize() {
    return {
      box: Object.assign({}, this.box),
      parentBox: Object.assign({}, this.parentBox)
    };
  }
  deserialize(state) {
    this.box = state.box;
    this.parentBox = state.parentBox;
  }

  getLayoutModes() {
    return {
      sizeMode: modes.SELF, // size depends entirely on children
      positionMode: modes.PARENT // position depends entirely on parent
    };
  }

  size() {
    const newBox = {
      x: 0,
      y: 0,
      width: 40,
      height: 40
    };
    this.box = newBox;
    this.parentBox = Object.assign({}, newBox);

    // return Object.assign({}, newBox);
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // NB: no need to set this.positionInfo here
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
