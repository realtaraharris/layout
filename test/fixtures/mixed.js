'use strict';
const {c} = require('../../src/layout');
const {Root} = require('../../src/components/root');
const {Label} = require('../../src/components/label');
const {SpacedLine} = require('../../src/components/spaced-line');

module.exports = ({x, y, width, height}) => {
  return c(
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
};
