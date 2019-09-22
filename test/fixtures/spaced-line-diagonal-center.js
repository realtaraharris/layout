'use strict';
const {c} = require('../../src/layout');
const {Root, Label, SpacedLine, Margin} = require('../../src/components');

module.exports = ({x, y, width, height}) => {
  const marginA = 100;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
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
        {mode: 'diagonal', align: 'center'},
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 25,
          text: 'i',
          showBoxes: true
        }),
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 25,
          text: 'Wide',
          showBoxes: true
        }),
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 25,
          text: '|',
          showBoxes: true
        })
      )
    )
  );
};
