'use strict';

const fs = require('fs');
const resemble = require('node-resemble-js');
const {createCanvas} = require('canvas');
const {renderRoot} = require('../../src/layout');
const WIDTH = 800;
const HEIGHT = 600;

/**
 * Clears the terminal's scrollback buffer
 */
function clearTerminal() {
  process.stdout.write('\x1Bc');
}

function setupComponentTest(fixture) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  const treeRoot = renderRoot(
    ctx,
    fixture({x: 0, y: 0, width: WIDTH, height: HEIGHT})
  );

  return {canvas, ctx, treeRoot};
}

function debugDot(ctx, target) {
  ctx.fillStyle = 'green';
  ctx.fillRect(target.x, target.y, 10, 10);
}

function screenshot(name, canvas, t) {
  const base = `${__dirname}/../screenshots/${name}`;

  const actualFull = `${base}-actual.png`;
  const expectedFull = `${base}-expected.png`;
  const diffFull = `${base}-diff.png`;

  const actualBuffer = canvas.toBuffer();

  fs.writeFileSync(actualFull, actualBuffer);

  if (!fs.existsSync(expectedFull)) {
    fs.writeFileSync(expectedFull, actualBuffer);
  }

  resemble(expectedFull)
    .compareTo(actualFull)
    .onComplete(result => {
      const exactMatch = result.misMatchPercentage === '0.00';

      t.ok(result.isSameDimensions);
      t.ok(exactMatch);

      if (!exactMatch) {
        const diffImage = result.getDiffImage();
        diffImage.pack().pipe(fs.createWriteStream(diffFull));
      } else {
        fs.existsSync(diffFull) && fs.unlinkSync(diffFull);
      }

      t.end();
    });
}

module.exports = {
  setupComponentTest,
  debugDot,
  clearTerminal,
  screenshot
};
