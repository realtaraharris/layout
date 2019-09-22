'use strict';

const {createCanvas} = require('canvas');
const tape = require('tape-catch');
const proxyquire = require('proxyquire');

const log = require('../src/log');
const {setupComponentTest, clearTerminal, screenshot} = require('./lib/util');
const {createCircle} = require('../src/geometry');

const WIDTH = 800;
const HEIGHT = 600;

clearTerminal();

const spacedLineHorizontalLeftWithMargin = require('./fixtures/spaced-line-horizontal-left-with-margin');

const spacedLineHorizontalRightWithMargin = require('./fixtures/spaced-line-horizontal-right-with-margin');

const spacedLineVerticalLeftWithMargin = require('./fixtures/spaced-line-vertical-left-with-margin');

const verticalLayout = require('./fixtures/vertical-layout');

const verticalLayoutRightAligned = require('./fixtures/vertical-layout-right-aligned');

const spacedLineVerticalRight = require('./fixtures/spaced-line-vertical-right');

const spacedLineVerticalCenter = require('./fixtures/spaced-line-vertical-center');

const spacedLineHorizontalCenter = require('./fixtures/spaced-line-horizontal-center');

const spacedLineDiagonalCenter = require('./fixtures/spaced-line-diagonal-center');

const spacedLineHorizontalRight = require('./fixtures/spaced-line-horizontal-right');

const spacedLineVerticalCenterWithMargin = require('./fixtures/spaced-line-vertical-center-with-margin');

const complexNested = require('./fixtures/complex-nested');

const margin = require('./fixtures/margin');

const horizontalLayout = require('./fixtures/horizontal-layout');

tape('spaced-line-horizontal-left-with-margin', t => {
  const {canvas} = setupComponentTest(spacedLineHorizontalLeftWithMargin);
  screenshot('spaced-line-horizontal-left-with-margin', canvas, t);
});

tape('spaced-line-horizontal-right-with-margin', t => {
  const {canvas} = setupComponentTest(spacedLineHorizontalRightWithMargin);
  screenshot('spaced-line-horizontal-right-with-margin', canvas, t);
});

tape('spaced-line-vertical-left-with-margin', t => {
  const {canvas} = setupComponentTest(spacedLineVerticalLeftWithMargin);
  screenshot('spaced-line-vertical-left-with-margin', canvas, t);
});

tape('vertical layout', t => {
  const {canvas} = setupComponentTest(verticalLayout);
  screenshot('vertical', canvas, t);
});

tape('vertical layout, right-aligned', t => {
  const {canvas} = setupComponentTest(verticalLayoutRightAligned);
  screenshot('vertical-right', canvas, t);
});

tape('spaced-line vertical right', t => {
  const {canvas} = setupComponentTest(spacedLineVerticalRight);
  screenshot('spaced-line-vertical-right', canvas, t);
});

tape('spaced-line vertical center', t => {
  const {canvas} = setupComponentTest(spacedLineVerticalCenter);
  screenshot('spaced-line-vertical-center', canvas, t);
});

tape('spaced-line horizontal center', t => {
  const {canvas} = setupComponentTest(spacedLineHorizontalCenter);
  screenshot('spaced-line-horizontal-center', canvas, t);
});

tape('spaced-line diagonal center', t => {
  const {canvas} = setupComponentTest(spacedLineDiagonalCenter);
  screenshot('spaced-line-diagonal-center', canvas, t);
});

tape('spaced-line-horizontal-right', t => {
  const {canvas} = setupComponentTest(spacedLineHorizontalRight);
  screenshot('spaced-line-horizontal-right', canvas, t);
});

tape('spaced-line-vertical-center-with-margin', t => {
  const {canvas} = setupComponentTest(spacedLineVerticalCenterWithMargin);
  screenshot('spaced-line-vertical-center-with-margin', canvas, t);
});

tape('complex-nested', t => {
  const {canvas} = setupComponentTest(complexNested);
  screenshot('complex-nested', canvas, t);
});

tape('margin', t => {
  const {canvas} = setupComponentTest(margin);
  screenshot('margin', canvas, t);
});

tape('horizontal layout', t => {
  const {canvas} = setupComponentTest(horizontalLayout);
  screenshot('horizontal', canvas, t);
});

tape('diagonal layout', t => {
  const {c, renderRoot} = require('../src/layout');
  const {Root, Margin, Button, Label, SpacedLine} = proxyquire(
    '../src/components',
    {
      './log': t.fail
    }
  );

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const marginA = 20;
  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'diagonal', align: 'left'},
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 20,
          text: 'Push Me',
          done: () => {}
        }),
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 20,
          text: 'Push Me',
          done: () => {}
        }),
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 20,
          text: 'Push Me',
          done: () => {}
        }),
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 20,
          text: 'Push Me',
          done: () => {}
        }),
        c(
          Button,
          {onInput: log, onClick: log},
          c(
            Margin,
            {
              top: marginA,
              bottom: marginA,
              left: marginA,
              right: marginA,
              showBoxes: true
            },
            c(
              SpacedLine,
              {mode: 'vertical', align: 'left'},
              c(Label, {
                font: 'sans',
                color: 'white',
                size: 100,
                text: 'A',
                showBoxes: true,
                done: () => {}
              }),
              c(Label, {
                font: 'sans',
                color: 'white',
                size: 100,
                text: 'A',
                showBoxes: true,
                done: () => {}
              })
            )
          )
        ),
        c(
          Button,
          {onInput: log, onClick: log},
          c(
            Margin,
            {
              top: marginA,
              bottom: marginA,
              left: marginA,
              right: marginA,
              showBoxes: true
            },
            c(Label, {
              font: 'sans',
              color: 'white',
              size: 20,
              text: 'B',
              showBoxes: true
            })
          )
        ),
        c(
          Button,
          {onInput: log, onClick: log},
          c(
            Margin,
            {
              top: marginA,
              bottom: marginA,
              left: marginA,
              right: marginA,
              showBoxes: true
            },
            c(Label, {
              font: 'serif',
              color: 'white',
              size: 30,
              text: 'C',
              showBoxes: true
            })
          )
        )
      )
    );

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
  screenshot('diagonal', canvas, t);
});

tape('mixed layout, no margins', t => {
  const {c, renderRoot} = require('../src/layout');
  const {Root, Label, SpacedLine} = proxyquire('../src/components', {
    './log': t.fail
  });

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'horizontal', align: 'left'},
        c(
          SpacedLine,
          {mode: 'vertical', align: 'left'},
          c(Label, {
            font: 'sans',
            color: 'white',
            size: 100,
            text: 'A',
            showBoxes: true,
            done: () => {}
          }),
          c(Label, {
            font: 'sans',
            color: 'white',
            size: 100,
            text: 'B',
            showBoxes: true,
            done: () => {}
          })
        ),
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
  screenshot('mixed', canvas, t);
});

tape('viewport', t => {
  const {renderRoot} = require('../src/layout');
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  const demo1 = require('./fixtures/viewport');

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
  screenshot('viewport', canvas, t);
});

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

tape('text', t => {
  const {c, renderRoot} = require('../src/layout');
  const {Root, Margin, Label, SpacedLine} = proxyquire('../src/components', {
    './log': t.fail
  });

  const {Text} = require('../src/components/text');

  const wordsToLiveBy = `When you grow up you tend to get told the world is the way it is and your job is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money. That's a very limited life. Life can be much broader once you discover one simple fact, and that is: everything around you that you call life, was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use. The minute that you understand that you can poke life and actually something will, you know if you push in, something will pop out the other side, that you can change it, you can mold it. That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it. I think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again.`;
  // const wordsToLiveBy = `discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace`

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const marginA = 20;

  const textWidth = 520;
  const textHeight = 360;

  const {fromPolygons} = require('../lib/csg/src/csg');
  const subjectPolygon = fromPolygons([
    [[0, 0], [textWidth, 0], [textWidth, textHeight], [0, textHeight]]
  ]);

  const clipPolygon = fromPolygons([
    [
      [12, 13], // x1, y1
      [33, 5],
      [10, 0]
    ].map(([x, y]) => [x * 20 - 150, y * 20 + 40])
  ]);

  const polygons = subjectPolygon.subtract(clipPolygon);

  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'vertical', align: 'left'},
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 100,
          text: 'Push Me',
          showBoxes: true,
          done: () => {}
        }),
        c(
          Margin,
          {
            top: marginA,
            bottom: marginA,
            left: marginA,
            right: 20,
            showBoxes: true
          },
          c(Text, {
            width: textWidth,
            height: textHeight,
            lineHeight: 20,
            font: 'sans',
            size: 100,
            text: wordsToLiveBy,
            style: {font: `${17}px serif`, fillStyle: 'white'},
            polygons,
            showBoxes: true,
            done: () => {}
          })
        )
      )
    );

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
  screenshot('text', canvas, t);
});

tape('text - concave cutout', t => {
  const {c, renderRoot} = require('../src/layout');
  const {Root, Margin, Label, SpacedLine} = proxyquire('../src/components', {
    './log': t.fail
  });

  const {Text} = require('../src/components/text');

  const wordsToLiveBy = `When you grow up you tend to get told the world is the way it is and your job is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money. That's a very limited life. Life can be much broader once you discover one simple fact, and that is: everything around you that you call life, was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use. The minute that you understand that you can poke life and actually something will, you know if you push in, something will pop out the other side, that you can change it, you can mold it. That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it. I think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again.`;

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const marginA = 10;

  const textWidth = 550;
  const textHeight = 460 + 40;

  const {fromPolygons} = require('../lib/csg/src/csg');
  const subjectPolygon = fromPolygons([
    [[0, 0], [textWidth, 0], [textWidth, textHeight], [0, textHeight]]
  ]);

  const clipPolygon = fromPolygons([
    [
      [7.4806, 14.0654],
      [0, 8.7],
      [9.1639, 8.7],
      [12, 0],
      [14.8237, 8.7],
      [24, 8.7],
      [16.5651, 14.0654],
      [19.4, 22.8],
      [11.9573, 17.3906],
      [4.6, 22.8]
    ].map(([x, y]) => [x * 20 + 0, y * 20 + 0])
  ]);

  const polygons = subjectPolygon.subtract(clipPolygon);

  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'vertical', align: 'left'},
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 100,
          text: 'Push Me',
          showBoxes: true,
          done: () => {}
        }),
        c(
          Margin,
          {
            top: marginA,
            bottom: marginA,
            left: marginA,
            right: marginA,
            showBoxes: true
          },
          c(Text, {
            width: textWidth,
            height: textHeight,
            lineHeight: 20,
            font: 'sans',
            size: 100,
            text: wordsToLiveBy,
            style: {font: `${20}px serif`, fillStyle: 'white'},
            polygons,
            showBoxes: true,
            done: () => {}
          })
        )
      )
    );

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
  screenshot('text-concave-cutout', canvas, t);
});

tape('text - diamond bounding polygon', t => {
  const {c, renderRoot} = require('../src/layout');
  const {Root, Margin, Label, SpacedLine} = proxyquire('../src/components', {
    './log': t.fail
  });

  const {Text} = require('../src/components/text');

  const wordsToLiveBy = `When you grow up you tend to get told the world is the way it is and your job is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money. That's a very limited life.\n\n\nLife can be much broader once you discover one simple fact, and that is: everything around you that you call life, was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use. The minute that you understand that you can poke life and actually something will, you know if you push in, something will pop out the other side, that you can change it, you can mold it. That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it. I think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again.`;
  // const wordsToLiveBy = `discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace`

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const marginA = 20;

  const textWidth = 500;
  const textHeight = 500;

  const {fromPolygons} = require('../lib/csg/src/csg');
  const subjectPolygon = fromPolygons([
    createCircle(250, 250, 130).map(([x, y]) => [x + 250, y + 250])
  ]);

  const clipPolygon = fromPolygons([
    [
      [7.4806, 14.0654],
      [0, 8.7],
      [9.1639, 8.7],
      [12, 0],
      [14.8237, 8.7],
      [24, 8.7],
      [16.5651, 14.0654],
      [19.4, 22.8],
      [11.9573, 17.3906],
      [4.6, 22.8]
    ].map(([x, y]) => [x * 20 + 10, y * 20 + 0])
  ]);

  const polygons = subjectPolygon.subtract(clipPolygon);

  const demo1 = ({x, y, width, height}) =>
    c(
      Root,
      {x, y, width, height, color: 'black'},
      c(
        SpacedLine,
        {mode: 'vertical', align: 'left'},
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 100,
          text: 'Push Me',
          showBoxes: true,
          done: () => {}
        }),
        c(
          Margin,
          {
            top: marginA,
            bottom: marginA,
            left: marginA,
            right: 20,
            showBoxes: true
          },
          c(Text, {
            width: textWidth,
            height: textHeight,
            lineHeight: 20,
            font: 'sans',
            size: 100,
            text: wordsToLiveBy,
            style: {font: `${17}px serif`, fillStyle: 'white'},
            polygons,
            showBoxes: true,
            done: () => {}
          })
        )
      )
    );

  renderRoot(ctx, demo1({x: 0, y: 0, width: WIDTH, height: HEIGHT}));
  screenshot('text-diamond', canvas, t);
});
