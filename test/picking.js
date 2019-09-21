'use strict';

const tape = require('tape-catch');
const {
  setupComponentTest,
  debugDot,
  clearTerminal,
  screenshot
} = require('./lib/util');
const {pickComponent} = require('../src/layout');

clearTerminal();

const labelButtonMarginLabel = require('./fixtures/button');

tape('click a label', t => {
  const {canvas, ctx, treeRoot} = setupComponentTest(labelButtonMarginLabel);

  const target = {x: 12, y: 24};
  const clickedLabel = pickComponent(treeRoot, target.x, target.y);
  debugDot(ctx, target);
  t.equals(clickedLabel.props.text, 'Push Me');

  screenshot('click-a-label', canvas, t);
});

tape('click a button', t => {
  const {canvas, ctx, treeRoot} = setupComponentTest(labelButtonMarginLabel);

  const target = {x: 170, y: 120};
  const clickedButton = pickComponent(treeRoot, target.x, target.y);
  debugDot(ctx, target);
  t.equals(clickedButton.props.text, 'A');

  screenshot('click-a-button', canvas, t);
});
