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
        alignVertical: 'top',
        alignHorizontal: 'left',
        stackChildren: 'horizontal',
        color: 'red',
        showBoxes: true
      },
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'top',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          color: 'blue',
          showBoxes: true
        },
        c(Rectangle, {
          color: 'blue',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes: true
        })
      ),
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'top',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          color: 'green',
          showBoxes: true
        },
        c(Rectangle, {
          color: 'green',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes: true
        })
      )
    )
  );
};
