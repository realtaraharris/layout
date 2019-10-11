'use strict';

// const POINTS_PER_INCH = 72;
// const UNITS_PER_EM = 2048;

// https://stackoverflow.com/a/26047748
// the canvas default resolution is 96dpi (CSS inches, not based on the actual screen). a scaleFactor of 2 gives 192dpi, 3 is 288dpi
// const fUnitsToPixels = (fUnitValue, pointSize, resolution) =>
//   (fUnitValue * pointSize * resolution) / (POINTS_PER_INCH * UNITS_PER_EM);

const fUnitsToPixels = (value, size) => ((value / -10) * size) / 100;

const getSideBearings = (font, size, character) => {
  // glyph xMax, xMin not defined for spaces
  if (character === ' ' || character === '\n') {
    return {
      left: 0,
      right: 0
    };
  }

  const {xMax, xMin, advanceWidth, leftSideBearing} = font.charToGlyph(
    character
  );

  const rightSideBearing = advanceWidth - (leftSideBearing + xMax - xMin);
  return {
    left: fUnitsToPixels(leftSideBearing, size),
    right: fUnitsToPixels(rightSideBearing, size)
  };
};

function getAdvanceWidth(font, text, size) {
  if (text === '\n') {
    return 0;
  }

  return font.getAdvanceWidth(text, size);
}

function getHorizontalTextMetrics(font, text, size) {
  if (text.length <= 0) {
    return;
  }

  const firstLabelChar = text[0];
  const lastLabelChar = text[text.length - 1];

  return {
    ascender: fUnitsToPixels(font.tables.hhea.ascender, size),
    descender: fUnitsToPixels(font.tables.hhea.descender, size),
    xHeight: fUnitsToPixels(font.tables.os2.sxHeight, size),
    capHeight: fUnitsToPixels(font.tables.os2.sCapHeight, size),
    advanceWidth: getAdvanceWidth(font, text, size),
    xOffsetStart: getSideBearings(font, size, firstLabelChar).left,
    xOffsetEnd: getSideBearings(font, size, lastLabelChar).right
  };
}

function getTextWidth(textMetrics) {
  return (
    textMetrics.advanceWidth + textMetrics.xOffsetStart + textMetrics.xOffsetEnd
  );
}

function getTextHeight(textMetrics, sizeMode) {
  return textMetrics[sizeMode] * -1;
}

function measureText(font, text, size, sizeMode) {
  const textMetrics = getHorizontalTextMetrics(font, text, size);
  return {
    textMetrics,
    width: getTextWidth(textMetrics),
    height: getTextHeight(textMetrics, sizeMode)
  };
}
exports.measureText = measureText;

// NB: opentype.js has font.draw(), but you can't set the color if you use it!
function fillText(renderContext, {font, text, box, xOffsetStart, size, color}) {
  const outlines = font.getPath(
    text,
    box.x + xOffsetStart,
    box.y + box.height,
    size
  );
  outlines.fill = color;
  outlines.draw(renderContext);
}
exports.fillText = fillText;
