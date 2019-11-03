'use strict';

const {calcDependencies} = require('../src/layout');
const tape = require('tape-catch');
const {setupComponentTest, screenshot, screenshotEx} = require('./lib/util');
const {createCanvas, registerFont} = require('canvas');

const {c} = require('../src/layout');
const Button = require('../src/components/button');
const Checkbox = require('../src/components/checkbox');
const Label = require('../src/components/label');
const Margin = require('../src/components/margin');
const Root = require('../src/components/root');
const SpacedLine = require('../src/components/spaced-line');
const Text = require('../src/components/text');
const Viewport = require('../src/components/viewport');
const opentype = require('opentype.js');
const {
  layout,
  render,
  diffTree,
  assignIds,
  sizeDown,
  calcBoxPositions
} = require('../src/layout');

const util = require('util');

tape('size dependency graph, simple', t => {
  const simpleFixture = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'simple',
        showBoxes: false
      })
    );
  const {canvas, treeRoot} = setupComponentTest(simpleFixture);
  assignIds(treeRoot, 0);

  const {sizeDeps, positionDeps} = calcDependencies(treeRoot);

  const labelId = 'Label-1-0-1688362664';
  const rootId = 'Root-0-0--464331121';
  t.deepEquals(sizeDeps.dependenciesOf(labelId), []);
  t.deepEquals(sizeDeps.dependenciesOf(rootId), []);

  t.deepEquals(positionDeps.dependenciesOf(labelId), [rootId]);
  t.deepEquals(positionDeps.dependenciesOf(rootId), []);

  screenshot('size-dep-graph-simple', canvas, t);
});

tape('size dependency graph, margin', t => {
  const marginFixture = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        Margin,
        {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
          showBoxes: true
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 20,
          sizeMode: 'capHeight',
          text: 'simple',
          showBoxes: false
        })
      )
    );
  const {canvas, treeRoot} = setupComponentTest(marginFixture);
  assignIds(treeRoot, 0);

  const {sizeDeps, positionDeps} = calcDependencies(treeRoot);

  const labelId = 'Label-2-0-1688362664';
  const marginId = 'Margin-1-0--931794642';
  const rootId = 'Root-0-0--464331121';

  t.deepEquals(sizeDeps.dependenciesOf(labelId), []);
  t.deepEquals(sizeDeps.dependenciesOf(marginId), [labelId]);
  t.deepEquals(sizeDeps.dependenciesOf(rootId), []);

  t.deepEquals(positionDeps.dependenciesOf(labelId), [rootId, marginId]);
  t.deepEquals(positionDeps.dependenciesOf(marginId), [rootId]);
  t.deepEquals(positionDeps.dependenciesOf(rootId), []);

  screenshot('size-dep-graph-margin', canvas, t);
});

tape('size dependency graph, viewport', t => {
  const viewportFixture = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        Viewport,
        {
          offsetX: 1.0,
          offsetY: 1.0,
          width: 10,
          height: 10
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 20,
          sizeMode: 'capHeight',
          text: 'simple',
          showBoxes: false
        })
      )
    );
  const {canvas, treeRoot} = setupComponentTest(viewportFixture);
  assignIds(treeRoot, 0);
  const {sizeDeps, positionDeps} = calcDependencies(treeRoot);

  const labelId = 'Label-2-0-1688362664';
  const viewportId = 'Viewport-1-0--913799541';
  const rootId = 'Root-0-0--464331121';

  t.deepEquals(sizeDeps.dependenciesOf(labelId), []);
  t.deepEquals(sizeDeps.dependenciesOf(viewportId), []);
  t.deepEquals(sizeDeps.dependenciesOf(rootId), []);

  t.deepEquals(positionDeps.dependenciesOf(labelId), [rootId, viewportId]);
  t.deepEquals(positionDeps.dependenciesOf(viewportId), [rootId]);
  t.deepEquals(positionDeps.dependenciesOf(rootId), []);

  screenshot('size-dep-graph-viewport', canvas, t);
});

tape('diff two trees', t => {
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
  registerFont('test/fixtures/SourceSansPro/SourceSansPro-Regular.ttf', {
    family: 'SourceSansPro-Regular'
  });
  registerFont('test/fixtures/SourceSerifPro/SourceSerifPro-Regular.ttf', {
    family: 'SourceSerifPro-Regular'
  });

  // NB: per the opentype.js docs, call this *after* registering fonts
  const canvas = createCanvas(WIDTH, HEIGHT);
  const renderContext = canvas.getContext('2d');
  renderContext.fonts = fonts;

  const viewportFixtureFirst = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        Viewport,
        {
          offsetX: 0.0,
          offsetY: 0.0,
          width: 100,
          height: 100
        },
        c(
          Margin,
          {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            showBoxes: true
          },
          c(Label, {
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 20,
            sizeMode: 'capHeight',
            text: 'simple',
            showBoxes: false
          })
        )
      )
    );

  const viewportFixtureSecond = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        Viewport,
        {
          offsetX: 0.0,
          offsetY: 0.0,
          width: 100,
          height: 100
        },
        c(
          Margin,
          {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            showBoxes: true
          },
          c(
            SpacedLine,
            {mode: 'vertical', align: 'left'},
            c(
              Margin,
              {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
                showBoxes: true
              },
              c(Label, {
                font: 'SourceSansPro-Regular',
                color: 'white',
                size: 20,
                sizeMode: 'capHeight',
                text: 'simple',
                showBoxes: false
              })
            ),
            c(Label, {
              font: 'SourceSansPro-Regular',
              color: 'white',
              size: 20,
              sizeMode: 'xHeight',
              text: '...ish',
              showBoxes: false
            })
          )
        )
      )
    );

  const treeRootFirst = layout(
    renderContext,
    viewportFixtureFirst({
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT
    })
  );
  assignIds(treeRootFirst, 0);

  const treeRootSecond = layout(
    renderContext,
    viewportFixtureSecond({
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT
    })
  );
  assignIds(treeRootSecond, 0);
  const firstDeps = calcDependencies(treeRootFirst);
  const secondDeps = calcDependencies(treeRootSecond);

  const diff = diffTree(treeRootFirst, treeRootSecond);
  console.log({diff});

  // recurse

  // console.log('firstDeps:', firstDeps);
  // console.log('secondDeps:', secondDeps);

  // const labelId = 'Label-1688362664';
  // const viewportId = 'Viewport--913799541';
  // const rootId = 'Root--464331121';

  // t.deepEquals(firstDeps.sizeDeps.dependenciesOf(labelId), []);
  // t.deepEquals(firstDeps.sizeDeps.dependenciesOf(viewportId), []);
  // t.deepEquals(firstDeps.sizeDeps.dependenciesOf(rootId), []);

  // t.deepEquals(firstDeps.positionDeps.dependenciesOf(labelId), [
  //   rootId,
  //   viewportId
  // ]);
  // t.deepEquals(firstDeps.positionDeps.dependenciesOf(viewportId), [rootId]);
  // t.deepEquals(firstDeps.positionDeps.dependenciesOf(rootId), []);

  // screenshot('size-dep-graph-viewport', canvas, t);
  // render(renderContext, treeRoot);

  // return {canvas, ctx: renderContext, treeRoot};

  // const {canvas, treeRoot} = setupComponentTest(viewportFixtureFirst);

  t.end();
});

function getDependencies(graph, treeRoot) {
  const dependencies = graph.dependenciesOf(treeRoot.name);
  return dependencies.map(depName => graph.getNodeData(depName));
}

tape.skip('tree diff viewport', t => {
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
  registerFont('test/fixtures/SourceSansPro/SourceSansPro-Regular.ttf', {
    family: 'SourceSansPro-Regular'
  });
  registerFont('test/fixtures/SourceSerifPro/SourceSerifPro-Regular.ttf', {
    family: 'SourceSerifPro-Regular'
  });

  // NB: per the opentype.js docs, call this *after* registering fonts
  const canvas = createCanvas(WIDTH, HEIGHT);
  const renderContext = canvas.getContext('2d');
  renderContext.fonts = fonts;

  const viewportFixtureFirst = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        Viewport,
        {
          offsetX: 0.0,
          offsetY: 0.0,
          width: 100,
          height: 100
        },
        c(
          Margin,
          {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            showBoxes: true
          },
          c(Label, {
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 20,
            sizeMode: 'capHeight',
            text: 'simple',
            showBoxes: false
          })
        )
      )
    );

  const viewportFixtureSecond = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        Viewport,
        {
          offsetX: 0.0,
          offsetY: 0.0,
          width: 100,
          height: 100
        },
        c(
          Margin,
          {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            showBoxes: true
          },
          c(
            Margin,
            {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
              showBoxes: true
            },
            c(Label, {
              font: 'SourceSansPro-Regular',
              color: 'white',
              size: 20,
              sizeMode: 'capHeight',
              text: 'simple',
              showBoxes: false
            })
          )
        )
      )
    );

  const treeRootFirst = layout(
    renderContext,
    viewportFixtureFirst({
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT
    })
  );
  assignIds(treeRootFirst, 0);

  const treeRootSecond = layout(
    renderContext,
    viewportFixtureSecond({
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT
    })
  );
  assignIds(treeRootSecond, 0);
  const firstDeps = calcDependencies(treeRootFirst);
  const secondDeps = calcDependencies(treeRootSecond);

  const diff = diffTree(treeRootFirst, treeRootSecond);
  console.log({diff});
  // console.log('\n' + util.inspect(diff, false, null, true));

  const rootDeps = getDependencies(
    secondDeps.sizeDeps,
    treeRootSecond //.children[0].children[0]
  );
  console.log('rootDeps:', rootDeps);

  sizeDown(renderContext, treeRootFirst);
  calcBoxPositions(renderContext, treeRootFirst, {x: 0, y: 0});
  // console.log('\n' + util.inspect(treeRootFirst, false, null, true));
  render(renderContext, treeRootFirst);
  screenshotEx('tree-diff-first', canvas, t);

  sizeDown(renderContext, treeRootSecond);
  calcBoxPositions(renderContext, treeRootSecond, {x: 0, y: 0});
  console.log('\n' + util.inspect(treeRootSecond, false, null, true));
  render(renderContext, treeRootSecond);
  screenshotEx('tree-diff-second', canvas, t, () => {
    t.end();
  });

  // recurse

  // console.log('firstDeps:', firstDeps);
  // console.log('secondDeps:', secondDeps);

  // const labelId = 'Label-1688362664';
  // const viewportId = 'Viewport--913799541';
  // const rootId = 'Root--464331121';

  // t.deepEquals(firstDeps.sizeDeps.dependenciesOf(labelId), []);
  // t.deepEquals(firstDeps.sizeDeps.dependenciesOf(viewportId), []);
  // t.deepEquals(firstDeps.sizeDeps.dependenciesOf(rootId), []);

  // t.deepEquals(firstDeps.positionDeps.dependenciesOf(labelId), [
  //   rootId,
  //   viewportId
  // ]);
  // t.deepEquals(firstDeps.positionDeps.dependenciesOf(viewportId), [rootId]);
  // t.deepEquals(firstDeps.positionDeps.dependenciesOf(rootId), []);

  // screenshot('size-dep-graph-viewport', canvas, t);
  // render(renderContext, treeRoot);

  // return {canvas, ctx: renderContext, treeRoot};

  // const {canvas, treeRoot} = setupComponentTest(viewportFixtureFirst);

  // t.end();
});

// IDEA: as you walk the tree, why not index it in an array, so that you can quickly access things by id? just walk the tree and push a reference to each node onto an array

/*
OKAY, this is how this is going to work:

1. using the root node from the current tree, flatten the dependency graph into a list of affected ids:



go through the resulting list. are ALL the deps the same as in the old tree?

if yes, copy the state from the old tree
if no, create a new component instance!

do a final walk in the tree, filling in gaps by 

2. check to see if the previous tree's node has the same identifier ("name" in this case)
    if same:
    if different:

*/
