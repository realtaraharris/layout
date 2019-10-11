'use strict';

const Layout = require('../components');
const {insertSorted} = require('../geometry');
const {fromPolygons} = require('../../lib/csg/src/csg');
const {measureText, fillText} = require('../font');

function split(input, font, size, sizeMode, hyphenChar) {
  // first split by newlines, ensuring that the newlines make it through as tokens, then split on whitespace
  const words = input
    .split(/(\n)/)
    .reduce((accum, current) => accum.concat(current.split(/[ [\]/\\]+/)), []);

  let result = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!word) {
      continue;
    }
    const syllables = word.split(hyphenChar);

    if (syllables.length > 1) {
      const measurements = syllables.map(syl => {
        const {textMetrics, width, height} = measureText(
          font,
          syl,
          size,
          sizeMode
        );
        return {
          width: width - textMetrics.xOffsetStart - textMetrics.xOffsetEnd,
          height,
          textMetrics
        };
      });
      result.push({token: syllables, type: 'syllables', measurements});
    } else {
      const {textMetrics, width, height} = measureText(
        font,
        word,
        size,
        sizeMode
      );
      result.push({token: word, type: 'word', width, height, textMetrics});
    }
  }
  return result;
}

function polyToBoundingBoxX(polygon) {
  let minX;
  let maxX = 0;

  for (let {x} of polygon) {
    if (minX === undefined || x < minX) {
      minX = x;
    } else if (x > maxX) {
      maxX = x;
    }
  }

  return [minX, maxX];
}

function polysToBoundingBox(polygons) {
  let minX;
  let maxX = 0;
  let minY;
  let maxY = 0;

  for (let polygon of polygons) {
    for (let {x, y} of polygon) {
      if (minX === undefined || x < minX) {
        minX = x;
      } else if (x > maxX) {
        maxX = x;
      }

      if (minY === undefined || y < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
    }
  }

  return [minX, minY, maxX, maxY];
}

function getRowBoxes(lineIndex, stepHeight, width, polygons) {
  let boxes = [];
  const y = lineIndex * stepHeight;
  const maxY = y + stepHeight;
  const linePolygon = fromPolygons([
    [[0, y], [width, y], [width, maxY], [0, maxY]]
  ]);
  const splitPolys = polygons.intersect(linePolygon).toPolygons();

  // as we get the horizontal boxes, get the bounding x coords
  const row = [];
  for (const splitPolygon of splitPolys) {
    if (splitPolygon.length < 3) {
      continue;
    } // filter out points, lines

    const [minX, maxX] = polyToBoundingBoxX(splitPolygon, y, maxY);

    if (minX === maxX) {
      continue;
    }

    insertSorted(row, minX); // ensure that each box will be sorted by the x coord
    insertSorted(row, maxX);
  }

  for (let j = 0; j < row.length - 1; j += 2) {
    const minX = row[j];
    const maxX = row[j + 1];

    boxes.push({
      startX: minX,
      endX: maxX,
      startY: y,
      endY: maxY,
      lineIndex: lineIndex
    });
  }

  return boxes;
}

function processBox(
  box,
  {startX, endX, startY, endY, lineIndex},
  tokens,
  tracking,
  lineHeight,
  sizeMode,
  spaceWidth,
  dashWidth,
  showBoxes
) {
  const finalX = box.x + startX;
  const finalY = box.y + startY;
  const finalW = endX - startX;
  const finalH = endY - startY;

  let tempWidth = 0;

  let result = [];
  let debugBoxes = [];

  if (showBoxes) {
    debugBoxes.push({
      color: 'teal',
      x: finalX,
      y: finalY,
      width: finalW,
      height: finalH
    });
  }

  while (tempWidth < finalW) {
    const token = tokens[tracking.tokenCursor];
    if (!token) {
      break;
    }

    if (token.token === '\n') {
      tracking.tokenCursor++; // don't render the newline token
      tracking.lastLineVisited = lineIndex + 1;
      break; // skip to the next box
    }

    if (lineIndex < tracking.lastLineVisited) {
      break;
    }

    if (token.type === 'word') {
      if (tempWidth > finalW - token.width) {
        tracking.lastLineVisited = lineIndex;
        break;
      }

      result.push({
        text: token.token,
        x: finalX + tempWidth,
        y: finalY - token.textMetrics[sizeMode]
      });

      if (showBoxes) {
        debugBoxes.push({
          color: 'rgba(200, 200, 200, 0.6)',
          x: finalX + tempWidth,
          y: finalY,
          width: token.width,
          height: lineHeight
        });
      }

      tempWidth += token.width + spaceWidth;
      tracking.tokenCursor++;
    } else if (token.type === 'syllables') {
      while (token.token[tracking.syllableCounter]) {
        const syl = token.token[tracking.syllableCounter];
        const meas = token.measurements[tracking.syllableCounter];

        const yyy = finalY - meas.textMetrics[sizeMode];

        if (tempWidth + meas.width + dashWidth <= finalW) {
          if (showBoxes) {
            debugBoxes.push({
              color: 'rgba(127, 63, 195, 0.6)',
              x: finalX + tempWidth,
              y: finalY,
              width: meas.width,
              height: lineHeight
            });
          }

          result.push({
            text: syl,
            x: finalX + tempWidth,
            y: yyy
          });

          tempWidth += meas.width;
          tracking.syllableCounter++;
        } else if (tracking.syllableCounter > 0) {
          result.push({
            text: '-',
            x: finalX + tempWidth,
            y: yyy
          });

          tracking.lastLineVisited = lineIndex;
          break;
        } else {
          tracking.lastLineVisited = lineIndex;
          break;
        }
      }

      if (tracking.syllableCounter >= token.token.length) {
        tracking.syllableCounter = 0;
        tracking.tokenCursor++;
        tempWidth += spaceWidth;
      } else {
        tracking.lastLineVisited = lineIndex;
        break;
      }
    } else {
      console.error('invalid type:', token.type);
    }
  }

  return {result, debugBoxes};
}

class Text extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(
    renderContext,
    {
      width,
      text,
      hyphenChar,
      size,
      sizeMode,
      polygons,
      font,
      lineHeight = 20,
      showBoxes
    },
    childBox
  ) {
    this.childBoxes.push(childBox);

    this.tokens = split(
      text,
      renderContext.fonts[font],
      size,
      sizeMode,
      hyphenChar
    );

    const f = renderContext.fonts[font];
    const dashWidth = measureText(f, '-', size, sizeMode).width;

    const spaceWidth = measureText(f, ' ', size, sizeMode).width;

    let [, , , maxY] = polysToBoundingBox(polygons.toPolygons());

    const tracking = {
      syllableCounter: 0,
      tokenCursor: 0,
      lastLineVisited: 0
    };

    let lineIndex = 0;
    this.finalBoxes = [];
    this.debugBoxes = [];
    for (;;) {
      const rowBoxes = getRowBoxes(lineIndex, lineHeight, width, polygons);

      for (let x = 0; x < rowBoxes.length; x++) {
        const {result, debugBoxes} = processBox(
          this.box,
          rowBoxes[x],
          this.tokens,
          tracking,
          lineHeight,
          sizeMode,
          spaceWidth,
          dashWidth,
          showBoxes
        );

        this.finalBoxes.push(...result);
        this.debugBoxes.push(...debugBoxes);
      }

      const currentY = lineIndex * lineHeight;

      if (currentY > maxY) {
        break;
      }
      if (tracking.tokenCursor === this.tokens.length) {
        maxY = currentY + lineHeight;
        break;
      }

      lineIndex++;
    }

    this.box = Object.assign({}, {width, height: maxY});
    return {width, height: maxY};
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    return [updatedParentPosition];
  }

  render(renderContext, {font, size, color, showBoxes = false}) {
    renderContext.beginPath();
    // renderContext.rect(this.box.x, this.box.y, this.box.width, this.box.height);
    // renderContext.clip();
    // renderContext.fillStyle = 'red';

    if (showBoxes) {
      for (let {color, x, y, width, height} of this.debugBoxes) {
        renderContext.strokeStyle = color;
        renderContext.strokeRect(this.box.x + x, this.box.y + y, width, height);
      }
    }
    // Object.assign(renderContext, style); // we need to paint text with a particular style
    renderContext.textBaseline = 'top';
    // console.log('color:', color, 'box:', this.box, 'lineHeight:', lineHeight);
    for (let {text, x, y} of this.finalBoxes) {
      const box = {
        x: this.box.x + x,
        y: this.box.y + y,
        height: 0 // crucial
      };

      fillText(renderContext, {
        font: renderContext.fonts[font],
        text,
        box,
        xOffsetStart: 0,
        size,
        color
      });
    }
  }
}

module.exports = Text;
