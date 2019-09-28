'use strict';

const {Layout} = require('../components');
const {insertSorted} = require('../geometry');
const {fromPolygons} = require('../../lib/csg/src/csg');

const createHyphenator = require('hyphen');
const hyphenationPatternsEnUs = require('hyphen/patterns/en-us');

function split(input, ctx, style) {
  // first split by newlines, ensuring that the newlines make it through as tokens, then split on whitespace
  const words = input
    .split(/(\n)/)
    .reduce((accum, current) => accum.concat(current.split(/[ [\]/\\]+/)), []);

  Object.assign(ctx, style); // we need to measure text with a particular style

  let result = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    const syllables = word.split('*');

    if (syllables.length > 1) {
      const measurements = syllables.map(syl => {
        const textMetrics = ctx.measureText(syl);

        return {
          width: textMetrics.width,
          height: textMetrics.emHeightAscent
        };
      });

      result.push({
        token: syllables,
        type: 'syllables',
        measurements
      });
    } else {
      const textMetrics = ctx.measureText(word);
      result.push({
        token: word,
        type: 'word',
        width: textMetrics.width,
        height: textMetrics.emHeightAscent
      });
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
        y: finalY + lineHeight
      });

      // if (showBoxes) {
      //   debugBoxes.push({
      //     color: 'rgba(127, 63, 195, 0.6)',
      //     x: finalX + tempWidth,
      //     y: finalY,
      //     width: token.width,
      //     height: lineHeight
      //   });
      // }

      tempWidth += token.width + spaceWidth;
      tracking.tokenCursor++;
    } else if (token.type === 'syllables') {
      while (token.token[tracking.syllableCounter]) {
        const syl = token.token[tracking.syllableCounter];
        const meas = token.measurements[tracking.syllableCounter].width;

        if (tempWidth + meas + dashWidth <= finalW) {
          if (showBoxes) {
            debugBoxes.push({
              color: 'rgba(127, 63, 195, 0.6)',
              x: finalX + tempWidth,
              y: finalY,
              width: meas,
              height: lineHeight
            });
          }

          result.push({
            text: syl,
            x: finalX + tempWidth,
            y: finalY + lineHeight
          });

          tempWidth += meas;
          tracking.syllableCounter++;
        } else if (tracking.syllableCounter > 0) {
          result.push({
            text: '-',
            x: finalX + tempWidth,
            y: finalY + lineHeight
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

  size(renderContext, props, childBox, childCount, cache) {
    console.log('cache:', cache);
    const {width, text, style, polygons, lineHeight = 20, showBoxes} = props;

    const key = JSON.stringify({props, childBox, type: 'size'});
    if (cache.get(key)) {
      const x = cache.get(key);
      this.box = x.box;
      this.childBoxes = x.childBoxes;
      this.finalBoxes = x.finalBoxes;
      this.debugBoxes = x.debugBoxes;
      this.tokens = x.tokens;
      return x.retval;
    }
    // if (this.checkMemo({props, childBox}, 'size')) {
    //   // console.log('found memo! skipping work!');
    //   return {width: this.box.width, height: this.box.height};
    // }
    // console.log('in text size method');

    this.childBoxes.push(childBox);

    const hyphen = createHyphenator(hyphenationPatternsEnUs, {
      hyphenChar: '*'
    });
    const syl = hyphen(text);

    this.tokens = split(syl, renderContext, style);

    Object.assign(renderContext, style); // we need to paint text with a particular style

    const dashWidth = renderContext.measureText('-').width;
    const spaceWidth = renderContext.measureText(' ').width;

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

    if (!cache.get(key)) {
      cache.set(key, {
        box: this.box,
        childBoxes: this.childBoxes,
        finalBoxes: this.finalBoxes,
        debugBoxes: this.debugBoxes,
        tokens: this.tokens,
        retval: {width, height: maxY}
      });
    }
    return {width, height: maxY};
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    return [updatedParentPosition];
  }

  render(renderContext, {lineHeight, showBoxes = false, style}) {
    renderContext.beginPath();
    renderContext.rect(this.box.x, this.box.y, this.box.width, this.box.height);
    renderContext.clip();

    if (showBoxes) {
      for (let {color, x, y, width, height} of this.debugBoxes) {
        renderContext.strokeStyle = color;
        renderContext.strokeRect(this.box.x + x, this.box.y + y, width, height);
      }
    }
    Object.assign(renderContext, style); // we need to paint text with a particular style
    renderContext.textBaseline = 'top';
    for (let {text, x, y} of this.finalBoxes) {
      renderContext.fillText(text, this.box.x + x, this.box.y + y - lineHeight);
    }
  }
}

module.exports = {Text};
