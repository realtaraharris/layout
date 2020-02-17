'use strict';

const fs = require('fs');
const util = require('util');
const resemble = require('node-resemble-js');
const {createCanvas, registerFont} = require('canvas');
const {render, layout} = require('../../src/layout');
const {printTree} = require('../../src/print-tree');
const tape = require('tape-catch');
const opentype = require('opentype.js');

const fonts = {
  'SourceSansPro-Regular': opentype.loadSync(
    'test/fixtures/SourceSansPro/SourceSansPro-Regular.ttf'
  ),
  'SourceSerifPro-Regular': opentype.loadSync(
    'test/fixtures/SourceSerifPro/SourceSerifPro-Regular.ttf'
  )
};

/**
 * Clears the terminal's scrollback buffer
 */
function clearTerminal() {
  process.stdout.write('\x1Bc');
}

function setupComponentTest(fixture, options) {
  registerFont('test/fixtures/SourceSansPro/SourceSansPro-Regular.ttf', {
    family: 'SourceSansPro-Regular'
  });
  registerFont('test/fixtures/SourceSerifPro/SourceSerifPro-Regular.ttf', {
    family: 'SourceSerifPro-Regular'
  });

  // NB: per the opentype.js docs, call this *after* registering fonts
  const canvas = createCanvas(
    options.width,
    options.height,
    options.canvasType
  );
  const renderContext = canvas.getContext('2d');
  if (options.canvasType === 'pdf') {
    renderContext.textDrawingMode = 'glyph'; // causes node-canvas to embed text
  }
  renderContext.fonts = fonts;

  let cache = {};
  const treeRoot = layout(
    renderContext,
    fixture({
      x: 0,
      y: 0,
      width: options.width,
      height: options.height
    }),
    cache
  );

  if (options.dumpTree) {
    printTree(treeRoot, 0);
  } else if (options.dumpFullTree) {
    console.log(util.inspect(treeRoot, false, null, true));
  }

  render(renderContext, treeRoot);

  return {canvas, ctx: renderContext, treeRoot};
}

function debugDot(ctx, target) {
  ctx.fillStyle = 'green';
  ctx.fillRect(target.clientX, target.clientY, 10, 10);
}

function screenshot(base, canvas, cb) {
  const actualFull = `${base}/actual.png`;
  const expectedFull = `${base}/expected.png`;
  const diffFull = `${base}/diff.png`;

  const actualBuffer = canvas.toBuffer();

  fs.writeFileSync(actualFull, actualBuffer);

  if (!fs.existsSync(expectedFull)) {
    fs.writeFileSync(expectedFull, actualBuffer);
  }

  resemble(expectedFull)
    .compareTo(actualFull)
    .onComplete(result => {
      const exactMatch = result.misMatchPercentage === '0.00';

      if (!exactMatch) {
        const diffImage = result.getDiffImage();
        diffImage.pack().pipe(fs.createWriteStream(diffFull));
      } else {
        fs.existsSync(diffFull) && fs.unlinkSync(diffFull);
      }

      cb(result.isSameDimensions, exactMatch);
    });
}

function executeTest(suite, testName, testRunner, options) {
  const finalOptions = Object.assign(
    {},
    {
      dumpTree: false,
      width: 800,
      height: 600,
      canvasType: undefined
    },
    options
  );

  testRunner(testName, t => {
    const {canvas} = setupComponentTest(
      require(`../${suite}/${testName}/fixture`),
      finalOptions
    );

    if (finalOptions.canvasType === 'pdf') {
      const result = canvas.toBuffer('application/pdf', {
        title: 'sample pdf',
        keywords: 'layout test',
        creationDate: new Date()
      });

      fs.writeFileSync(
        `${__dirname}/../${suite}/${testName}/actual.pdf`,
        result
      );
      t.end();
    } else {
      screenshot(
        `${__dirname}/../${suite}/${testName}`,
        canvas,
        (isSameDimensions, exactMatch) => {
          t.ok(isSameDimensions);
          t.ok(exactMatch);
          t.end();
        }
      );
    }
  });
}

function test(suite, testName, options) {
  executeTest(suite, testName, tape, options);
}

function only(suite, testName, options) {
  executeTest(suite, testName, tape.only, options);
}

function skip(suite, testName, options) {
  executeTest(suite, testName, tape.skip, options);
}

module.exports = {
  setupComponentTest,
  debugDot,
  clearTerminal,
  screenshot,
  test,
  only,
  skip
};
