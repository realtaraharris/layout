'use strict';

const tape = require('tape-catch');

const {setupComponentTest, screenshot} = require('./lib/util');

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
