'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const SpacedLine = require('../../src/components/spaced-line');

module.exports = ({x, y, width, height}) => {
  const marginA = 0;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'horizontal', align: 'left'},
      c(Label, {
        font: 'sans',
        color: 'white',
        size: 90,
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
        c(Label, {
          font: 'sans',
          size: 100,
          text: 'A',
          showBoxes: true,
          color: 'white',
          done: () => {}
        })
      )
    )
  );
};
