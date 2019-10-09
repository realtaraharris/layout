'use strict';

const Layout = require('../components');

class Viewport extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(renderContext, {width, height}, childBox) {
    this.childBoxes.push(childBox);

    this.box = Object.assign({}, {width, height});
    return {width, height};
  }

  position(renderContext, {offsetX, offsetY}, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // TODO: this should only accept a SINGLE child, not an array!
    const absX = (this.box.width - this.childBoxes[0].width) * offsetX;
    const absY = (this.box.height - this.childBoxes[0].height) * offsetY;

    const result = [
      {
        x: this.box.x + absX,
        y: this.box.y + absY
      }
    ];

    return result;
  }

  render(renderContext) {
    renderContext.strokeStyle = 'teal';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );

    renderContext.beginPath();
    renderContext.rect(this.box.x, this.box.y, this.box.width, this.box.height);
    renderContext.clip();
  }

  intersect({clientX, clientY, deltaX, deltaY}, eventName) {
    const {box} = this;
    const childBox = this.childBoxes[0];
    const insideBox =
      clientX >= box.x &&
      clientX <= box.x + box.width &&
      clientY >= box.y &&
      clientY <= box.y + box.height;

    if (insideBox && eventName === 'click') {
      return {
        hit: false,
        descend: true
      };
    } else if (insideBox && eventName === 'scroll') {
      return {
        hit: true,
        descend: false,
        box,
        childBox,
        event: {clientX, clientY, deltaX, deltaY}
      };
    }
    return {
      hit: false,
      descend: false
    };
  }
}

module.exports = Viewport;
