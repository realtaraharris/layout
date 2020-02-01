'use strict';

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const FlowBox = require('../../../src/components/flow-box');
const Label = require('../../../src/components/label');
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
        alignVertical: 'center',
        alignHorizontal: 'center',
        stackChildren: 'vertical',
        color: 'red',
        showBoxes: true
      },
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'black',
        size: 50,
        sizeMode: 'xHeight',
        text: 'a',
        showBoxes: false
      }),

      c(Rectangle, {
        color: 'rgba(255, 203, 5, 0.1)',
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0,
        showBoxes: true
      }),

      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'black',
        size: 500,
        sizeMode: 'xHeight',
        text: 'b',
        showBoxes: false
      })
    )
  );
};
