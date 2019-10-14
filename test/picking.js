'use strict';

const tape = require('tape-catch');
const {setupComponentTest, debugDot, screenshot} = require('./lib/util');
const {click} = require('../src/layout');

tape('click a label', t => {
  t.plan(3);
  const onLabelClick = event => {
    const expectedEvent = {
      box: {x: 0, y: 0, width: 303.11964843749996, height: 59.4},
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
        x: 104.65962890624998,
        y: 59.4,
        width: 93.800390625,
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
        x: 80.42003906249998,
        y: 145.10000000000002,
        width: 46.6702734375,
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
