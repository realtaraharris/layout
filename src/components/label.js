'use strict';

const Layout = require('../components');

// const POINTS_PER_INCH = 72;
// const UNITS_PER_EM = 2048;

// https://stackoverflow.com/a/26047748
// the canvas default resolution is 96dpi (CSS inches, not based on the actual screen). a scaleFactor of 2 gives 192dpi, 3 is 288dpi
// const fUnitsToPixels = (fUnitValue, pointSize, resolution) =>
//   (fUnitValue * pointSize * resolution) / (POINTS_PER_INCH * UNITS_PER_EM);
const fUnitsToPixels = (value, size) => ((value / -10) * size) / 100;
const getXOffset = (f, size, character) => {
  const {leftSideBearing} = f.charToGlyph(character);
  return fUnitsToPixels(leftSideBearing, size);
};

class Label extends Layout {
  // TODO: add check to ensure labels have NO children
  // sends a child box up
  size(renderContext, {text, size, font, sizeMode = 'xHeight'}) {
    // renderContext.font = `${size}px ${font}`;

    const f = renderContext.fonts[font];
    const textMetrics = {
      ascender: f.tables.hhea.ascender,
      descender: f.tables.hhea.descender,
      xHeight: f.tables.os2.sxHeight,
      capHeight: f.tables.os2.sCapHeight
    };
    this.textMetrics = textMetrics;

    if (text.length > 0) {
      const firstLabelChar = text[0];
      const lastLabelChar = text[text.length - 1];

      this.xOffsetStart = getXOffset(f, size, firstLabelChar);
      this.xOffsetEnd = getXOffset(f, size, lastLabelChar);
    }

    const w =
      f.getAdvanceWidth(text, size) + this.xOffsetStart + this.xOffsetEnd;

    const newBox = {
      x: 0,
      y: 0,
      width: w,
      height: fUnitsToPixels(textMetrics[sizeMode], size) * -1
    };
    this.box = newBox;

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
    renderContext.fillStyle = color;
    // renderContext.font = `${size}px ${font}`;
    // renderContext.fillText(text, this.box.x, this.box.y + this.box.height);

    const horizontalLine = (y, color) => {
      const yyy = this.box.y + this.box.height + y;
      renderContext.beginPath();
      renderContext.moveTo(this.box.x + 0, yyy);
      renderContext.lineTo(this.box.x + this.box.width, yyy);
      renderContext.strokeStyle = color;
      renderContext.setLineDash([5, 5]);
      renderContext.stroke();
    };

    const f = renderContext.fonts[font];

    // NB: opentype.js has f.draw(), but you can't set the color if you use it!
    const outlines = f.getPath(
      text,
      this.box.x + this.xOffsetStart,
      this.box.y + this.box.height,
      size
    );
    outlines.fill = color;
    outlines.draw(renderContext);

    if (showBoxes) {
      horizontalLine(0, 'gray');
      horizontalLine(fUnitsToPixels(this.textMetrics.ascender, size), 'blue');
      horizontalLine(fUnitsToPixels(this.textMetrics.descender, size), 'green');
      horizontalLine(fUnitsToPixels(this.textMetrics.xHeight, size), 'orange');
      horizontalLine(fUnitsToPixels(this.textMetrics.capHeight, size), 'red');
    }
  }
}

module.exports = Label;
