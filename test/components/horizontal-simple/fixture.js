'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const ShrinkingFlowBox = require('../../../src/components/shrinking-flow-box');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      ShrinkingFlowBox,
      {mode: 'horizontal', align: 'center'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false
      })
    )
  );
};
