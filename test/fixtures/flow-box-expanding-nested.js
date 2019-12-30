'use strict';

const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const ExpandingFlowBox = require('../../src/components/expanding-flow-box');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      ExpandingFlowBox,
      {
        mode: 'horizontal',
        align: 'left',
        expand: 'bidirectional',
        color: 'red'
      },
      c(ExpandingFlowBox, {
        mode: 'vertical',
        align: 'left',
        expand: 'bidirectional',
        color: 'blue'
      }),
      c(ExpandingFlowBox, {
        mode: 'vertical',
        align: 'left',
        expand: 'bidirectional',
        color: 'green'
      })
    )
  );
};
