'use strict';

const Layout = require('../components');
const {measureText, fillText} = require('../font');
const encode = require('hashcode').hashCode;

class Label extends Layout {
  constructor(props) {
    super(props);
    this.hash = encode().value(props);
  }

  // TODO: add check to ensure labels have NO children
  // sends a child box up
  size(
    renderContext,
    {text, size, font, sizeMode = 'xHeight'},
    childBox,
    childCount,
    cache
  ) {
    // query the cache. if we have an entry in there, we can skip all this
    const cachedState = cache[this.hash];
    if (cachedState) {
      this.box = Object.assign({}, cachedState.box);
      this.textMetrics = Object.assign({}, cachedState.textMetrics);
      return Object.assign({}, cachedState.returnValue);
    }

    const {textMetrics, width, height} = measureText(
      renderContext,
      renderContext.fonts[font],
      font, // TODO: rename to fontName
      text,
      size,
      sizeMode
    );
    const newBox = {x: 0, y: 0, width, height};
    this.box = newBox;
    this.textMetrics = textMetrics;

    // if we're down here, we have things we need to add to the cache
    cache[this.hash] = {
      box: this.box,
      textMetrics: this.textMetrics,
      returnValue: newBox
    };

    return newBox;
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
      fontName: font,
      text,
      box: this.box,
      xOffsetStart: this.textMetrics.xOffsetStart,
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
