'use strict';

const {createCanvas} = require('canvas');
const tape = require('tape-catch');
const proxyquire = require('proxyquire');

// const {setupComponentTest, clearTerminal, screenshot} = require('./lib/util');

const WIDTH = 800;
const HEIGHT = 600;

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
