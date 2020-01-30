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
        sizing: 'expand',
        mode: 'horizontal',
        align: 'left',
        showBoxes,
        color: 'red'
      },
      c(
        FlowBox,
        {
          sizing: 'expand',
          mode: 'vertical',
          align: 'left',
          showBoxes,
          color: 'blue'
        },
        c(Rectangle, {
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
          sizing: 'expand',
          mode: 'vertical',
          align: 'left',
          showBoxes,
          color: 'blue'
        },
        c(Rectangle, {
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
          sizing: 'expand',
          mode: 'vertical',
          align: 'left',
          showBoxes,
          color: 'blue'
        },
        c(Rectangle, {
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
