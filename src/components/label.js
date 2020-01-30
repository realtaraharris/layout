'use strict';

const Layout = require('../components');
const {measureText, fillText} = require('../font');
const encode = require('hashcode').hashCode;
const PropTypes = require('introspective-prop-types');

class Label extends Layout {
  constructor(props) {
    super(props);
    this.hash = encode().value(props);
  }

  // TODO: add check to ensure labels have NO children
  size(
    {text, size, font, sizeMode = 'xHeight'},
    {renderContext, sizing, cache}
  ) {
    if (sizing !== 'shrink') {
      return;
    }

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
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
  }

  render({text, size, font, color, showBoxes, selection}, {renderContext}) {
    fillText(renderContext, {
      fontName: font,
      text,
      box: this.box,
      xOffsetStart: this.textMetrics.xOffsetStart,
      size,
      color
    });
    const {advanceWidths} = this.textMetrics;

    if (selection && advanceWidths) {
      if (selection.length === 2) {
        const [selectionStart, selectionEnd] = selection;

        const selStartPx = advanceWidths[selectionStart];
        const selEndPx = advanceWidths[selectionEnd];

        // draw the selection rectangle
        renderContext.fillStyle = 'rgba(128, 128, 255, 0.5)';

        const x = this.box.x + selStartPx + this.textMetrics.xOffsetStart;
        const y = this.box.y;
        const width = selEndPx - selStartPx + this.textMetrics.xOffsetStart;
        const height = this.box.height;

        renderContext.fillRect(x, y, width, height);
      } else if (selection.length === 1) {
        const [cursorPosition] = selection;
        const selPx = advanceWidths[cursorPosition];

        const cursorPadding = 2;

        // draw the cursor
        renderContext.strokeStyle = 'rgba(128, 128, 255, 0.5)';
        const x = this.box.x + selPx + this.textMetrics.xOffsetStart;
        const y = this.box.y - cursorPadding;
        const height = this.box.height + cursorPadding * 2;

        renderContext.beginPath();
        renderContext.moveTo(x, y);
        renderContext.lineTo(x, y + height);
        renderContext.strokeStyle = 'black';
        renderContext.stroke();
      }
    }

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

Label.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  font: PropTypes.string.isRequired,
  sizeMode: PropTypes.oneOf([
    'descender',
    'baseline',
    'xHeight',
    'capHeight',
    'ascender'
  ]).isRequired,
  color: PropTypes.string.isRequired,
  showBoxes: PropTypes.bool.isRequired
};

module.exports = Label;
