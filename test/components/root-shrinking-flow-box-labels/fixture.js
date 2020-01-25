'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const ShrinkingFlowBox = require('../../../src/components/shrinking-flow-box');
const Label = require('../../../src/components/label');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      ShrinkingFlowBox,
      {mode: 'horizontal', align: 'left'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 100,
        sizeMode: 'capHeight',
        text: 'A',
        showBoxes: false
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 100,
        sizeMode: 'capHeight',
        text: 'i',
        showBoxes: false
      })
    )
  );
};
