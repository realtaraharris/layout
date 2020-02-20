'use strict';

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const FlowBox = require('../../../src/components/flow-box');
const Rectangle = require('../../../src/components/rectangle');

module.exports = ({x, y, width, height}) => {
  const showBoxes = true;
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      FlowBox,
      {
        sizingHorizontal: 'expand',
        sizingVertical: 'expand',
        alignVertical: 'center',
        alignHorizontal: 'left',
        stackChildren: 'horizontal',
        showBoxes,
        color: 'red'
      },
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'center',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          showBoxes,
          color: 'blue'
        },
        c(Rectangle, {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          color: '#FFDD00',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        })
      ),
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'center',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          showBoxes,
          color: 'blue'
        },
        c(Rectangle, {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          color: 'orange',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        })
      ),
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'center',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          showBoxes,
          color: 'blue'
        },
        c(Rectangle, {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          color: 'red',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        })
      )
    )
  );
};
