'use strict';

const {createCanvas} = require('canvas');
const tape = require('tape-catch');
const proxyquire = require('proxyquire');
const opentype = require('opentype.js');

// const {setupComponentTest, clearTerminal, screenshot} = require('./lib/util');

const fonts = {
  'SourceSansPro-Regular': opentype.loadSync(
    'test/fixtures/SourceSansPro/SourceSansPro-Regular.ttf'
  ),
  'SourceSerifPro-Regular': opentype.loadSync(
    'test/fixtures/SourceSerifPro/SourceSerifPro-Regular.ttf'
  )
};

const WIDTH = 800;
const HEIGHT = 600;

function getRenderContext() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const renderContext = canvas.getContext('2d');
  renderContext.fonts = fonts;
  return renderContext;
}

tape('components-line-215', t => {
  t.plan(2);
  const {c, layout} = require('../src/layout');

  const logTest = {'../log': t.ok}; // the test passes only if we trigger the error
  const Root = require('../src/components/root');
  const Label = require('../src/components/label');
  const FlowBox = proxyquire('../src/components/flow-box', logTest);

  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        FlowBox,
        {
          sizingHorizontal: 'shrink',
          sizingVertical: 'shrink',
          alignVertical: 'top',
          alignHorizontal: 'heft',
          stackChildren: 'horizontal'
        },
        c(Label, {font: 'SourceSansPro-Regular', size: 20, text: 'c'}),
        c(Label, {font: 'SourceSerifPro-Regular', size: 30, text: 'd'})
      )
    );

  let cache = {};
  layout(
    getRenderContext(),
    demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}),
    cache
  );
});

tape('components-line-228', t => {
  t.plan(2);
  const {c, layout} = require('../src/layout');

  const logTest = {'../log': t.ok}; // the test passes only if we trigger the error
  const Root = require('../src/components/root');
  const Label = require('../src/components/label');
  const FlowBox = proxyquire('../src/components/flow-box', logTest);

  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        FlowBox,
        {
          sizingHorizontal: 'shrink',
          sizingVertical: 'shrink',
          alignVertical: 'top',
          alignHorizontal: 'heft',
          stackChildren: 'vertical'
        },
        c(Label, {font: 'SourceSansPro-Regular', size: 20, text: 'c'}),
        c(Label, {font: 'SourceSerifPro-Regular', size: 30, text: 'd'})
      )
    );

  let cache = {};
  layout(
    getRenderContext(),
    demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}),
    cache
  );
});

tape('components-line-236', t => {
  t.plan(6);
  const {c, layout} = require('../src/layout');
  const logTest = {'../log': t.ok}; // the test passes only if we trigger the error
  const Root = require('../src/components/root');
  const Label = require('../src/components/label');
  const FlowBox = proxyquire('../src/components/flow-box', logTest);

  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        FlowBox,
        {
          sizingHorizontal: 'shrink',
          sizingVertical: 'shrink',
          alignVertical: 'top',
          alignHorizontal: 'left',
          stackChildren: 'diagone'
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          size: 20,
          text: 'c',
          showBoxes: true
        }),
        c(Label, {
          font: 'SourceSerifPro-Regular',
          size: 30,
          text: 'd',
          showBoxes: true
        })
      )
    );

  let cache = {};
  layout(
    getRenderContext(),
    demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}),
    cache
  );
});

tape('components-line-246', t => {
  t.plan(6);
  const {c, layout} = require('../src/layout');
  const logTest = {'../log': t.ok}; // the test passes only if we trigger the error
  const Root = require('../src/components/root');
  const Label = require('../src/components/label');
  const FlowBox = proxyquire('../src/components/flow-box', logTest);

  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        FlowBox,
        {
          sizingHorizontal: 'shrink',
          sizingVertical: 'shrink',
          alignVertical: 'top',
          alignHorizontal: 'left',
          stackChildren: 'invalid-mode'
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 20,
          text: 'c',
          showBoxes: true
        }),
        c(Label, {
          font: 'SourceSerifPro-Regular',
          color: 'white',
          size: 30,
          text: 'd',
          showBoxes: true
        })
      )
    );

  let cache = {};
  layout(
    getRenderContext(),
    demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}),
    cache
  );
});
