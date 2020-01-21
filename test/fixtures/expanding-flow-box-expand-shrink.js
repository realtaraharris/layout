'use strict';

const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const ExpandingFlowBox = require('../../src/components/expanding-flow-box');
const ShrinkingFlowBox = require('../../src/components/shrinking-flow-box');
const Label = require('../../src/components/label');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      ExpandingFlowBox,
      {
        mode: 'horizontal',
        color: 'gray',
        showBoxes: true
      },
      c(
        ShrinkingFlowBox,
        {
          mode: 'horizontal',
          align: 'left',
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
      c(ExpandingFlowBox, {
        mode: 'horizontal',
        color: 'green',
        showBoxes: true
      }),
      c(ExpandingFlowBox, {
        mode: 'horizontal',
        color: 'blue',
        showBoxes: true
      })
    )
  );
};
