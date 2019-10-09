'use strict';

// const POINTS_PER_INCH = 72;
// const UNITS_PER_EM = 2048;

// https://stackoverflow.com/a/26047748
// the canvas default resolution is 96dpi (CSS inches, not based on the actual screen). a scaleFactor of 2 gives 192dpi, 3 is 288dpi
// const fUnitsToPixels = (fUnitValue, pointSize, resolution) =>
//   (fUnitValue * pointSize * resolution) / (POINTS_PER_INCH * UNITS_PER_EM);

const fUnitsToPixels = (value, size) => ((value / -10) * size) / 100;
exports.fUnitsToPixels = fUnitsToPixels;

const getSideBearings = (font, size, character) => {
  const {xMax, xMin, advanceWidth, leftSideBearing} = font.charToGlyph(
    character
  );
  const rightSideBearing = advanceWidth - (leftSideBearing + xMax - xMin);
  return {
    left: fUnitsToPixels(leftSideBearing, size),
    right: fUnitsToPixels(rightSideBearing, size)
  };
};
exports.getSideBearings = getSideBearings;

function getHorizontalTextMetrics(font, text, size) {
  if (text.length <= 0) {
    return;
  }

  const firstLabelChar = text[0];
  const lastLabelChar = text[text.length - 1];

  return {
    ascender: font.tables.hhea.ascender,
    descender: font.tables.hhea.descender,
    xHeight: font.tables.os2.sxHeight,
    capHeight: font.tables.os2.sCapHeight,
    advanceWidth: font.getAdvanceWidth(text, size),
    xOffsetStart: getSideBearings(font, size, firstLabelChar).left,
    xOffsetEnd: getSideBearings(font, size, lastLabelChar).right
  };
}
exports.getHorizontalTextMetrics = getHorizontalTextMetrics;

function getTextWidth(textMetrics) {
  return (
    textMetrics.advanceWidth + textMetrics.xOffsetStart + textMetrics.xOffsetEnd
  );
}
exports.getTextWidth = getTextWidth;

function getTextHeight(textMetrics, sizeMode, size) {
  return fUnitsToPixels(textMetrics[sizeMode], size) * -1;
}
exports.getTextHeight = getTextHeight;

function measureText(font, text, size, sizeMode) {
  const textMetrics = getHorizontalTextMetrics(font, text, size);
  return {
    textMetrics,
    width: getTextWidth(textMetrics),
    height: getTextHeight(textMetrics, sizeMode, size)
  };
}
exports.measureText = measureText;

// NB: opentype.js has font.draw(), but you can't set the color if you use it!
function fillText(renderContext, {font, text, box, textMetrics, size, color}) {
  const outlines = font.getPath(
    text,
    box.x + textMetrics.xOffsetStart,
    box.y + box.height,
    size
  );
  outlines.fill = color;
  outlines.draw(renderContext);
}
exports.fillText = fillText;
