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
      {mode: 'horizontal', align: 'left'},
      c(
        ShrinkingFlowBox,
        {mode: 'vertical', align: 'left'},
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 100,
          sizeMode: 'capHeight',
          text: 'A',
          showBoxes: false,
          done: () => {}
        }),
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 100,
          sizeMode: 'capHeight',
          text: 'B',
          showBoxes: false,
          done: () => {}
        })
      ),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'c',
        showBoxes: false
      }),
      c(Label, {
        font: 'SourceSerifPro-Regular',
        color: 'white',
        size: 30,
        sizeMode: 'capHeight',
        text: 'd',
        showBoxes: false
      })
    )
  );
};