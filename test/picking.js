'use strict';

const tape = require('tape-catch');
const {setupComponentTest, debugDot, screenshot} = require('./lib/util');
const {click} = require('../src/layout');

tape('click a label', t => {
  t.plan(3);
  const onLabelClick = event => {
    const expectedEvent = {
      box: {x: 0, y: 0, width: 355.166015625, height: 69.3017578125},
      childBox: undefined,
      event: {clientX: 12, clientY: 24, deltaX: undefined, deltaY: undefined}
    };

    t.deepEquals(event, expectedEvent, 'event');
  };
  const buttonClickingFixture = require('./fixtures/button-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    buttonClickingFixture({onLabelClick})
  );

  const rawEvent = {clientX: 12, clientY: 24};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);
  screenshot('click-a-label', canvas, t); // second, third assertions
});

tape('click a button', t => {
  t.plan(3);
  const onButtonClick = event => {
    const expectedEvent = {
      box: {
        x: 124.2333984375,
        y: 69.3017578125,
        width: 106.69921875,
        height: 117.001953125
      },
      childBox: undefined,
      event: undefined
    };
    t.deepEquals(event, expectedEvent, 'event');
  };
  const buttonClickingFixture = require('./fixtures/button-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    buttonClickingFixture({onButtonClick})
  );

  const rawEvent = {clientX: 170, clientY: 120};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);
  screenshot('click-a-button', canvas, t); // second, third assertions
});

tape('click a button inside a viewport', t => {
  t.plan(3);
  const onLabelClick = event => {
    const expectedEvent = {
      box: {
        x: 55.6298828125,
        y: 130.9970703125,
        width: 58.9306640625,
        height: 73.9013671875
      },
      childBox: undefined,
      event: undefined
    };
    t.deepEquals(event, expectedEvent, 'event');
  };
  const viewportClickingFixture = require('./fixtures/viewport-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    viewportClickingFixture({onLabelClick})
  );

  const rawEvent = {clientX: 100, clientY: 190};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);
  screenshot('click-inside-viewport', canvas, t); // second, third assertions
});

tape('click an occluded button inside a viewport', t => {
  t.plan(2);
  const onLabelClick = event => {
    t.fail(); // first assertion
  };
  const viewportClickingFixture = require('./fixtures/viewport-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    viewportClickingFixture({
      onLabelClick
    })
  );

  const rawEvent = {clientX: 80, clientY: 190};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);
  screenshot('click-occluded-button-inside-viewport', canvas, t); // second, third assertions
});
