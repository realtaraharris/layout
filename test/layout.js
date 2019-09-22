'use strict';

const {createCanvas} = require('canvas');
const tape = require('tape-catch');
const proxyquire = require('proxyquire');

const {setupComponentTest, clearTerminal, screenshot} = require('./lib/util');

const WIDTH = 800;
const HEIGHT = 600;

clearTerminal();

const spacedLineHorizontalLeftWithMargin = require('./fixtures/spaced-line-horizontal-left-with-margin');

const spacedLineHorizontalRightWithMargin = require('./fixtures/spaced-line-horizontal-right-with-margin');

const spacedLineVerticalLeftWithMargin = require('./fixtures/spaced-line-vertical-left-with-margin');

const verticalLayout = require('./fixtures/vertical-layout');

const verticalLayoutRightAligned = require('./fixtures/vertical-layout-right-aligned');

const spacedLineVerticalRight = require('./fixtures/spaced-line-vertical-right');

const spacedLineVerticalCenter = require('./fixtures/spaced-line-vertical-center');

const spacedLineHorizontalCenter = require('./fixtures/spaced-line-horizontal-center');

const spacedLineDiagonalCenter = require('./fixtures/spaced-line-diagonal-center');

const spacedLineHorizontalRight = require('./fixtures/spaced-line-horizontal-right');

const spacedLineVerticalCenterWithMargin = require('./fixtures/spaced-line-vertical-center-with-margin');

const complexNested = require('./fixtures/complex-nested');

const margin = require('./fixtures/margin');

const horizontalLayout = require('./fixtures/horizontal-layout');

const diagonalLayout = require('./fixtures/diagonal-layout');

const mixedLayoutNoMargins = require('./fixtures/mixed-layout-no-margins');

const viewport = require('./fixtures/viewport');

const text = require('./fixtures/text');

const textConcaveCutout = require('./fixtures/text-concave-cutout');

const textDiamondBoundingPolygon = require('./fixtures/text-diamond-bounding-polygon');

tape('spaced-line-horizontal-left-with-margin', t => {
  const {canvas} = setupComponentTest(spacedLineHorizontalLeftWithMargin);
  screenshot('spaced-line-horizontal-left-with-margin', canvas, t);
});

tape('spaced-line-horizontal-right-with-margin', t => {
  const {canvas} = setupComponentTest(spacedLineHorizontalRightWithMargin);
  screenshot('spaced-line-horizontal-right-with-margin', canvas, t);
});

tape('spaced-line-vertical-left-with-margin', t => {
  const {canvas} = setupComponentTest(spacedLineVerticalLeftWithMargin);
  screenshot('spaced-line-vertical-left-with-margin', canvas, t);
});

tape('vertical layout', t => {
  const {canvas} = setupComponentTest(verticalLayout);
  screenshot('vertical', canvas, t);
});

tape('vertical layout, right-aligned', t => {
  const {canvas} = setupComponentTest(verticalLayoutRightAligned);
  screenshot('vertical-right', canvas, t);
});

tape('spaced-line vertical right', t => {
  const {canvas} = setupComponentTest(spacedLineVerticalRight);
  screenshot('spaced-line-vertical-right', canvas, t);
});

tape('spaced-line vertical center', t => {
  const {canvas} = setupComponentTest(spacedLineVerticalCenter);
  screenshot('spaced-line-vertical-center', canvas, t);
});

tape('spaced-line horizontal center', t => {
  const {canvas} = setupComponentTest(spacedLineHorizontalCenter);
  screenshot('spaced-line-horizontal-center', canvas, t);
});

tape('spaced-line diagonal center', t => {
  const {canvas} = setupComponentTest(spacedLineDiagonalCenter);
  screenshot('spaced-line-diagonal-center', canvas, t);
});

tape('spaced-line-horizontal-right', t => {
  const {canvas} = setupComponentTest(spacedLineHorizontalRight);
  screenshot('spaced-line-horizontal-right', canvas, t);
});

tape('spaced-line-vertical-center-with-margin', t => {
  const {canvas} = setupComponentTest(spacedLineVerticalCenterWithMargin);
  screenshot('spaced-line-vertical-center-with-margin', canvas, t);
});

tape('complex-nested', t => {
  const {canvas} = setupComponentTest(complexNested);
  screenshot('complex-nested', canvas, t);
});

tape('margin', t => {
  const {canvas} = setupComponentTest(margin);
  screenshot('margin', canvas, t);
});

tape('horizontal layout', t => {
  const {canvas} = setupComponentTest(horizontalLayout);
  screenshot('horizontal', canvas, t);
});

tape('diagonal layout', t => {
  const {canvas} = setupComponentTest(diagonalLayout);
  screenshot('diagonal', canvas, t);
});

tape('mixed layout, no margins', t => {
  const {canvas} = setupComponentTest(mixedLayoutNoMargins);
  screenshot('mixed', canvas, t);
});

tape('viewport', t => {
  const {canvas} = setupComponentTest(viewport);
  screenshot('viewport', canvas, t);
});

tape('components-line-215', t => {
  t.plan(2);
  const {c, renderRoot} = require('../src/layout');
  const {Root, Label, SpacedLine} = proxyquire('../src/components', {
    './log': t.ok // the test passes only if we trigger the error
  });

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'horizontal', align: 'heft'},
        c(Label, {font: 'sans', size: 20, text: 'c'}),
        c(Label, {font: 'serif', size: 30, text: 'd'})
      )
    );

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
});

tape('components-line-228', t => {
  t.plan(2);
  const {c, renderRoot} = require('../src/layout');
  const {Root, Label, SpacedLine} = proxyquire('../src/components', {
    './log': t.ok // the test passes only if we trigger the error
  });

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'vertical', align: 'heft'},
        c(Label, {font: 'sans', size: 20, text: 'c'}),
        c(Label, {font: 'serif', size: 30, text: 'd'})
      )
    );

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
});

tape('components-line-236', t => {
  t.plan(6);
  const {c, renderRoot} = require('../src/layout');
  const {Root, Label, SpacedLine} = proxyquire('../src/components', {
    './log': t.ok // the test passes only if we trigger the error
  });

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'diagone', align: 'left'},
        c(Label, {
          font: 'sans',
          size: 20,
          text: 'c',
          showBoxes: true
        }),
        c(Label, {
          font: 'serif',
          size: 30,
          text: 'd',
          showBoxes: true
        })
      )
    );

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
});

tape('components-line-246', t => {
  t.plan(6);
  const {c, renderRoot} = require('../src/layout');
  const {Root, Label, SpacedLine} = proxyquire('../src/components', {
    './log': t.ok // the test passes only if we trigger the error
  });

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'bertical', align: 'left'},
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 20,
          text: 'c',
          showBoxes: true
        }),
        c(Label, {
          font: 'serif',
          color: 'white',
          size: 30,
          text: 'd',
          showBoxes: true
        })
      )
    );

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
});

tape('text', t => {
  const {canvas} = setupComponentTest(text);
  screenshot('text', canvas, t);
});

tape('text - concave cutout', t => {
  const {canvas} = setupComponentTest(textConcaveCutout);
  screenshot('text-concave-cutout', canvas, t);
});

tape('text - diamond bounding polygon', t => {
  const {canvas} = setupComponentTest(textDiamondBoundingPolygon);
  screenshot('text-diamond', canvas, t);
});
