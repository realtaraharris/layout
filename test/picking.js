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
const viewport = require('./fixtures/viewport');

tape('click a label', t => {
  const {canvas, ctx, treeRoot} = setupComponentTest(labelButtonMarginLabel);

  const target = {x: 12, y: 24};
  const clickedComponents = pickComponent(treeRoot, target.x, target.y);
  debugDot(ctx, target);
  t.equals(clickedComponents.length, 1, 'found one component');
  t.equals(clickedComponents[0].props.text, 'Push Me');

  screenshot('click-a-label', canvas, t);
});

tape('click a button', t => {
  const {canvas, ctx, treeRoot} = setupComponentTest(labelButtonMarginLabel);

  const target = {x: 170, y: 120};
  const clickedComponents = pickComponent(treeRoot, target.x, target.y);
  debugDot(ctx, target);
  t.equals(clickedComponents.length, 1, 'found one component');
  t.equals(clickedComponents[0].props.width, 200);

  screenshot('click-a-button', canvas, t);
});

tape('click a button inside a viewport', t => {
  const {canvas, ctx, treeRoot} = setupComponentTest(viewport);

  const target = {x: 100, y: 190};
  const clickedComponents = pickComponent(treeRoot, target.x, target.y);
  debugDot(ctx, target);
  t.equals(clickedComponents.length, 1);

  screenshot('click-inside-viewport', canvas, t);
});

tape('click an occluded button inside a viewport', t => {
  const {canvas, ctx, treeRoot} = setupComponentTest(viewport);

  const target = {x: 80, y: 190};
  const clickedComponents = pickComponent(treeRoot, target.x, target.y);
  debugDot(ctx, target);
  t.equals(clickedComponents.length, 0);

  screenshot('click-occluded-button-inside-viewport', canvas, t);
});
