'use strict';

const Layout = require('../components');

class Label extends Layout {
  // TODO: add check to ensure labels have NO children
  // sends a child box up
  size(renderContext, {text, size, font}) {
    renderContext.font = `${size}px ${font}`;
    const textMetrics = renderContext.measureText(text);
    const newBox = {
      x: 0,
      y: 0,
      width: textMetrics.width,
      height: textMetrics.emHeightAscent
    };
    this.box = newBox;

    return Object.assign({}, newBox);
  }

  // eslint-disable-next-line no-unused-vars
  position(renderContext, {x, y, width, height}, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // return value ignored in leaf nodes such as these
    // TODO: add assertions that ths component has no children!
    // we want to give users an error if they're doing that!
  }

  render(renderContext, {text, size, font, color}) {
    renderContext.fillStyle = color;
    renderContext.font = `${size}px ${font}`;
    renderContext.fillText(text, this.box.x, this.box.y + this.box.height);
  }
}

module.exports = Label;
