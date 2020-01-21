'use strict';

const fs = require('fs');
const util = require('util');
const resemble = require('node-resemble-js');
const {createCanvas, registerFont} = require('canvas');
const {render, layout, printTree} = require('../../src/layout');
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

const WIDTH = 800;
const HEIGHT = 600;

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
  const canvas = createCanvas(WIDTH, HEIGHT);
  const renderContext = canvas.getContext('2d');
  renderContext.fonts = fonts;

  let cache = {};
  const treeRoot = layout(
    renderContext,
    fixture({x: 0, y: 0, width: WIDTH, height: HEIGHT}),
    cache
  );

  // treeRoot.children[0].children[0].children[1].instance.box.y = 20.1;
  // treeRoot.children[0].children[0].children[1].instance.box.width = 266.67;
  // treeRoot.children[0].children[0].children[1].instance.box.height = 559.8;
  // treeRoot.children[0].children[0].children[2].instance.box.y = 579.9;

  // treeRoot.children[0].children[1].children[1].instance.box.x = 266.67;
  // treeRoot.children[0].children[1].children[1].instance.box.y = 20.1;
  // treeRoot.children[0].children[1].children[1].instance.box.width = 266.67;
  // treeRoot.children[0].children[1].children[1].instance.box.height = 579.9;

  // treeRoot.children[0].children[2].children[1].instance.box.x = 533.33;
  // treeRoot.children[0].children[2].children[1].instance.box.y = 20.1;
  // treeRoot.children[0].children[2].children[1].instance.box.width = 266.67;
  // treeRoot.children[0].children[2].children[1].instance.box.height = 579.9;

  if (options && options.dumpTree) {
    printTree(treeRoot, 0);
  } else if (options && options.dumpFullTree) {
    console.log(util.inspect(treeRoot, false, null, true));
  }

  render(renderContext, treeRoot);

  return {canvas, ctx: renderContext, treeRoot};
}

function debugDot(ctx, target) {
  ctx.fillStyle = 'green';
  ctx.fillRect(target.clientX, target.clientY, 10, 10);
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

function executeTest(testName, testRunner, options) {
  testRunner(testName, t => {
    const {canvas} = setupComponentTest(
      require(`../fixtures/${testName}`),
      options
    );
    screenshot(testName, canvas, t);
  });
}

function test(testName, options) {
  executeTest(testName, tape, options);
}

function only(testName, options) {
  executeTest(testName, tape.only, options);
}

function skip(testName, options) {
  executeTest(testName, tape.skip, options);
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
