'use strict';

const {c} = require('../../src/layout');
const {SpacedLine} = require('../../src/components');
const {Root} = require('../../src/components/root');
const {Label} = require('../../src/components/label');

module.exports = ({x, y, width, height}) => {
  const showChild = false;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'horizontal', align: 'center'},
      c(Label, {
        font: 'sans',
        color: 'white',
        size: 20,
        text: 'You can see this',
        showBoxes: true
      }),
      showChild &&
        c(Label, {
          font: 'sans',
          color: 'white',
          size: 20,
          text: `but if you see this, that's a paddlin'`,
          showBoxes: true
        })
    )
  );
};
