'use strict';

const tape = require('tape');

const {hashesDown} = require('../src/layout');

const {c} = require('../src/layout');
const Root = require('../src/components/root');
const Label = require('../src/components/label');
const Margin = require('../src/components/margin');
const SpacedLine = require('../src/components/spaced-line');
const Viewport = require('../src/components/viewport');
const Button = require('../src/components/button');
const log = require('../src/log');
const util = require('util');

const fixture1 = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'horizontal', align: 'center'},
      c(
        Margin,
        {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
        c(Label, {
          font: 'SourceSerifPro-Regular',
          color: 'white',
          size: 30,
          sizeMode: 'capHeight',
          text: 'item 0',
          showBoxes: false
        })
      ),
      c(
        SpacedLine,
        {mode: 'vertical', align: 'center'},
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'SourceSerifPro-Regular',
            color: 'white',
            size: 30,
            sizeMode: 'capHeight',
            text: 'item 1',
            showBoxes: false
          })
        ),
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'SourceSerifPro-Regular',
            color: 'white',
            size: 30,
            sizeMode: 'capHeight',
            text: 'item 2',
            showBoxes: false
          })
        )
      )
    )
  );
};

tape('tree diffing', t => {
  const firstTree = fixture1({
    x: 0,
    y: 0,
    width: 500,
    height: 500
  });
  hashesDown(firstTree);
  const inspectDepth = 2;
  console.log(util.inspect(firstTree, false, inspectDepth, true));
  t.end();
});
