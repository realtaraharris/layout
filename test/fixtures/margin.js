'use strict';
const {c} = require('../../src/layout');
const {Root, Label, SpacedLine, Margin} = require('../../src/components');

module.exports = ({x, y, width, height}) => {
  const marginA = 10;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'horizontal', align: 'left'},
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
          size: 100,
          text: 'A',
          showBoxes: true,
          done: () => {}
        })
      ),
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
          size: 100,
          text: 'i',
          showBoxes: true,
          done: () => {}
        })
      )
    )
  );
};
