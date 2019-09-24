'use strict';

const tape = require('tape-catch');
const {setupComponentTest, debugDot, screenshot} = require('./lib/util');
const {click} = require('../src/layout');

tape('click a label', t => {
  t.plan(3);
  const onLabelClick = event => {
    console.log(event); // TODO: decide what `event` contains
    t.pass('label click'); // first assertion
  };
  const buttonClickingFixture = require('./fixtures/button-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    buttonClickingFixture({onLabelClick})
  );

  const target = {x: 12, y: 24};
  click(treeRoot, target.x, target.y);
  debugDot(ctx, target);

  screenshot('click-a-label', canvas, t); // second, third assertions
});

tape('click a button', t => {
  t.plan(3);
  const onButtonClick = event => {
    console.log(event); // TODO: decide what `event` contains
    t.pass('button click'); // first assertion
  };
  const buttonClickingFixture = require('./fixtures/button-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    buttonClickingFixture({onButtonClick})
  );

  const target = {x: 170, y: 120};
  click(treeRoot, target.x, target.y);
  debugDot(ctx, target);

  screenshot('click-a-button', canvas, t); // second, third assertions
});

tape('click a button inside a viewport', t => {
  t.plan(3);
  const onLabelClick = event => {
    console.log(event); // TODO: decide what `event` contains
    t.pass(); // first assertion
  };
  const viewportClickingFixture = require('./fixtures/viewport-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    viewportClickingFixture({onLabelClick})
  );

  const target = {x: 100, y: 190};
  click(treeRoot, target.x, target.y);
  debugDot(ctx, target);

  screenshot('click-inside-viewport', canvas, t); // second, third assertions
});

tape('click an occluded button inside a viewport', t => {
  t.plan(2);
  const onLabelClick = event => {
    console.log(event); // TODO: decide what `event` contains
    t.fail(); // first assertion
  };
  const viewportClickingFixture = require('./fixtures/viewport-click');
  const {canvas, ctx, treeRoot} = setupComponentTest(
    viewportClickingFixture({
      onLabelClick
    })
  );

  const target = {x: 80, y: 190};
  click(treeRoot, target.x, target.y);
  debugDot(ctx, target);

  screenshot('click-occluded-button-inside-viewport', canvas, t); // second, third assertions
});
