'use strict';

const fs = require('fs');
const resemble = require('node-resemble-js');

/**
 * Clears the terminal's scrollback buffer
 */
function clearTerminal() {
  process.stdout.write('\x1Bc');
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
  clearTerminal,
  screenshot
};
