'use strict';

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const FlowBox = require('../../../src/components/flow-box');
const Rectangle = require('../../../src/components/rectangle');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      FlowBox,
      {
        sizingHorizontal: 'expand',
        sizingVertical: 'expand',
        alignHorizontal: 'center',
        alignVertical: 'center',
        stackChildren: 'horizontal',
        color: 'red',
        showBoxes: true
      },
      c(Rectangle, {
        sizingHorizontal: 'expand',
        sizingVertical: 'expand',
        color: 'rgba(255, 203, 5, 0.5)',
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0,
        showBoxes: true
      })
    )
  );
};
