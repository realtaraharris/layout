'use strict';

const Layout = require('../components');

class Viewport extends Layout {
  size({width, height}) {
    this.box = {
      x: 0,
      y: 0,
      width,
      height
    };

    this.childBoxes = [
      {
        x: this.box.x,
        y: this.box.y,
        width: this.box.width,
        height: this.box.height
      }
    ];
  }

  position({offsetX, offsetY}, {children, parentBox}) {
    const child = children[0]; // TODO: make sure you have a child!

    const absX = (this.box.width - child.instance.box.width) * offsetX;
    const absY = (this.box.height - child.instance.box.height) * offsetY;

    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    this.childBoxes = [
      {
        x: this.box.x + absX,
        y: this.box.y + absY,
        width: this.box.width,
        height: this.box.height
      }
    ];
  }

  render(props, {renderContext}) {
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

    if (
      insideBox &&
      (eventName === 'click' ||
        eventName === 'mousedown' ||
        eventName === 'mouseup' ||
        eventName === 'mousemove')
    ) {
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
