'use strict';

const tape = require('tape-catch');

const {setupComponentTest, screenshot} = require('./lib/util');

function runTest(testName, testRunner) {
  testRunner(testName, t => {
    const {canvas} = setupComponentTest(require(`./fixtures/${testName}`));
    screenshot(testName, canvas, t);
  });
}

runTest('spaced-line-horizontal-left-with-margin', tape);
runTest('spaced-line-horizontal-right-with-margin', tape);
runTest('spaced-line-vertical-left-with-margin', tape);

tape('vertical', t => {
  const verticalLayout = require('./fixtures/vertical-layout');
  const {canvas} = setupComponentTest(verticalLayout);
  screenshot('vertical', canvas, t);
});

tape('vertical layout, right-aligned', t => {
  const verticalLayoutRightAligned = require('./fixtures/vertical-layout-right-aligned');
  const {canvas} = setupComponentTest(verticalLayoutRightAligned);
  screenshot('vertical-right', canvas, t);
});

runTest('spaced-line-vertical-right', tape);
runTest('spaced-line-vertical-center', tape);
runTest('spaced-line-horizontal-center', tape);
runTest('spaced-line-diagonal-center', tape);
runTest('spaced-line-horizontal-right', tape);
runTest('spaced-line-vertical-center-with-margin', tape);
runTest('complex-nested', tape);
runTest('margin', tape);

tape('horizontal layout', t => {
  const horizontalLayout = require('./fixtures/horizontal-layout');
  const {canvas} = setupComponentTest(horizontalLayout);
  screenshot('horizontal', canvas, t);
});

tape('diagonal layout', t => {
  const diagonalLayout = require('./fixtures/diagonal-layout');
  const {canvas} = setupComponentTest(diagonalLayout);
  screenshot('diagonal', canvas, t);
});

tape('mixed layout, no margins', t => {
  const mixedLayoutNoMargins = require('./fixtures/mixed-layout-no-margins');
  const {canvas} = setupComponentTest(mixedLayoutNoMargins);
  screenshot('mixed', canvas, t);
});

runTest('viewport', tape);
runTest('text', tape);
runTest('text-concave-cutout', tape);

tape('text - diamond bounding polygon', t => {
  const textDiamondBoundingPolygon = require('./fixtures/text-diamond-bounding-polygon');
  const {canvas} = setupComponentTest(textDiamondBoundingPolygon);
  screenshot('text-diamond', canvas, t);
});
