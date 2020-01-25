'use strict';

const tape = require('tape-catch');
const {setupComponentTest, debugDot, screenshot} = require('../lib/util');
const {click} = require('../../src/layout');

tape('click a label', t => {
  t.plan(8);
  const onLabelClick = event => {
    t.equals(event.box.x, 0);
    t.equals(event.box.y, 0);
    t.equals(event.box.width, 303.47999999999996);
    t.equals(event.box.height, 59.4);
    t.equals(event.childBox, undefined);
    t.deepEquals(event.event, {
      clientX: 12,
      clientY: 24,
      deltaX: undefined,
      deltaY: undefined
    });
  };
  const buttonClickingFixture = require('./fixtures/button-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    buttonClickingFixture({onLabelClick})
  );

  const rawEvent = {clientX: 12, clientY: 24};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);

  screenshot(`${__dirname}/click-a-label`, canvas, t); // second, third assertions
});

tape('click a button', t => {
  t.plan(8);
  const onButtonClick = event => {
    t.equals(event.box.x, 105.03999999999998);
    t.equals(event.box.y, 59.4);
    t.equals(event.box.width, 93.4);
    t.equals(event.box.height, 106);
    t.equals(event.childBox, undefined);
    t.equals(event.event, undefined);
  };
  const buttonClickingFixture = require('./fixtures/button-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    buttonClickingFixture({onButtonClick})
  );

  const rawEvent = {clientX: 146, clientY: 110};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);
  screenshot(`${__dirname}/click-a-button`, canvas, t); // second, third assertions
});

tape('click a button inside a viewport', t => {
  t.plan(8);
  const onLabelClick = event => {
    t.equals(event.box.x, 80.37999999999997);
    t.equals(event.box.y, 145.10000000000002);
    t.equals(event.box.width, 46.39);
    t.equals(event.box.height, 66.2);
    t.equals(event.childBox, undefined);
    t.equals(event.event, undefined);
  };
  const viewportClickingFixture = require('./fixtures/viewport-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    viewportClickingFixture({onLabelClick})
  );

  const rawEvent = {clientX: 105, clientY: 190};
  click(treeRoot, rawEvent, 'click');

  debugDot(ctx, rawEvent);
  screenshot(`${__dirname}/click-inside-viewport`, canvas, t); // second, third assertions
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
  screenshot(`${__dirname}/click-occluded-button-inside-viewport`, canvas, t); // second, third assertions
});

tape('mouse over a label', t => {
  t.plan(3);
  const firstLabelEventHandler = () => {
    t.fail();
  };

  const secondLabelEventHandler = () => {
    t.pass();
  };

  const mousemoveClickingFixture = require('./fixtures/mousemove-label');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    mousemoveClickingFixture({
      firstLabelEventHandler,
      secondLabelEventHandler
    })
  );

  const xOffset = 100;
  const yOffset = 20;
  let rawEvent = {clientX: 30 + xOffset, clientY: 0 + yOffset};
  click(treeRoot, rawEvent, 'mousemove');
  debugDot(ctx, rawEvent);

  rawEvent = {clientX: 200 + xOffset, clientY: 10 + yOffset};
  click(treeRoot, rawEvent, 'mousemove');
  debugDot(ctx, rawEvent);

  screenshot(`${__dirname}/mouse-over-a-label`, canvas, t); // second, third assertions
});
