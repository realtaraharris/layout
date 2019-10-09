'use strict';

const Layout = require('../components');
const {measureText, fillText} = require('../font');

class Label extends Layout {
  // TODO: add check to ensure labels have NO children
  // sends a child box up
  size(renderContext, {text, size, font, sizeMode = 'xHeight'}) {
    const {textMetrics, width, height} = measureText(
      renderContext.fonts[font],
      text,
      size,
      sizeMode
    );
    const newBox = {x: 0, y: 0, width, height};
    this.box = newBox;
    this.textMetrics = textMetrics;

    return Object.assign({}, newBox);
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // return value ignored in leaf nodes such as these
    // TODO: add assertions that ths component has no children!
    // we want to give users an error if they're doing that!
  }

  render(renderContext, {text, size, font, color, showBoxes}) {
    fillText(renderContext, {
      font: renderContext.fonts[font],
      text,
      box: this.box,
      textMetrics: this.textMetrics,
      size,
      color
    });

    if (showBoxes) {
      const horizontalLine = (y, color) => {
        const bottomLine = this.box.y + this.box.height + y;
        renderContext.beginPath();
        renderContext.moveTo(this.box.x + 0, bottomLine);
        renderContext.lineTo(this.box.x + this.box.width, bottomLine);
        renderContext.strokeStyle = color;
        renderContext.setLineDash([1, 1]);
        renderContext.stroke();
      };

      horizontalLine(0, 'gray');
      horizontalLine(this.textMetrics.ascender, 'blue');
      horizontalLine(this.textMetrics.descender, 'green');
      horizontalLine(this.textMetrics.xHeight, 'orange');
      horizontalLine(this.textMetrics.capHeight, 'red');
    }
  }
}

module.exports = Label;
