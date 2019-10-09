'use strict';

const tape = require('tape-catch');
const {setupComponentTest, debugDot, screenshot} = require('./lib/util');
const {click} = require('../src/layout');

tape('click a label', t => {
  t.plan(3);
  const onLabelClick = event => {
    const expectedEvent = {
      box: {x: 0, y: 0, width: 302.4, height: 59.4},
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
        x: 104.29999999999998,
        y: 59.4,
        width: 93.80000000000001,
        height: 106
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

  const rawEvent = {clientX: 146, clientY: 110};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);
  screenshot('click-a-button', canvas, t); // second, third assertions
});

tape('click a button inside a viewport', t => {
  t.plan(3);
  const onLabelClick = event => {
    const expectedEvent = {
      box: {
        x: 83.57000000000006,
        y: 145.10000000000002,
        width: 48,
        height: 66.2
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

  const rawEvent = {clientX: 105, clientY: 190};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);
  screenshot('click-inside-viewport', canvas, t); // second, third assertions
});

tape('click an occluded button inside a viewport', t => {
  t.plan(2);
  const onLabelClick = () => {
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
