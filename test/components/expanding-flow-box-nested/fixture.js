'use strict';

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const FlowBox = require('../../../src/components/flow-box');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      FlowBox,
      {
        sizing: 'expand',
        mode: 'horizontal',
        align: 'left',
        color: 'red',
        showBoxes: true
      },
      c(FlowBox, {
        sizing: 'expand',
        mode: 'vertical',
        align: 'left',
        color: 'blue',
        showBoxes: true
      }),
      c(FlowBox, {
        sizing: 'expand',
        mode: 'vertical',
        align: 'left',
        color: 'green',
        showBoxes: true
      })
    )
  );
};
