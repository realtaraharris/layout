'use strict';

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const ExpandingFlowBox = require('../../../src/components/expanding-flow-box');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      ExpandingFlowBox,
      {
        mode: 'horizontal',
        align: 'left',
        color: 'red',
        showBoxes: true
      },
      c(ExpandingFlowBox, {
        mode: 'vertical',
        align: 'left',
        color: 'blue',
        showBoxes: true
      }),
      c(ExpandingFlowBox, {
        mode: 'vertical',
        align: 'left',
        color: 'green',
        showBoxes: true
      })
    )
  );
};
