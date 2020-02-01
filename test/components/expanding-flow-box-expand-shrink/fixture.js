'use strict';

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const FlowBox = require('../../../src/components/flow-box');
const Label = require('../../../src/components/label');

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
        color: 'gray',
        showBoxes: true
      },
      c(
        FlowBox,
        {
          sizingHorizontal: 'shrink',
          sizingVertical: 'shrink',
          alignVertical: 'top',
          alignHorizontal: 'left',
          stackChildren: 'horizontal',
          color: 'red',
          showBoxes: true
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'black',
          size: 20,
          sizeMode: 'capHeight',
          text: 'happenstance',
          showBoxes: true
        }),
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'black',
          size: 20,
          sizeMode: 'capHeight',
          text: 'happenstance2',
          showBoxes: true
        })
      ),
      c(FlowBox, {
        sizingHorizontal: 'expand',
        sizingVertical: 'expand',
        alignVertical: 'top',
        alignHorizontal: 'left',
        stackChildren: 'horizontal',
        color: 'green',
        showBoxes: true
      }),
      c(FlowBox, {
        sizingHorizontal: 'expand',
        sizingVertical: 'expand',
        alignVertical: 'top',
        alignHorizontal: 'left',
        stackChildren: 'horizontal',
        color: 'blue',
        showBoxes: true
      })
    )
  );
};
