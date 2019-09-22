'use strict';
const {c} = require('../../src/layout');
const {Root, Label, SpacedLine, Margin} = require('../../src/components');

module.exports = ({x, y, width, height}) => {
  const marginA = 0;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'horizontal', align: 'right'},
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
          color: 'white',
          showBoxes: true,
          done: () => {}
        })
      )
    )
  );
};
