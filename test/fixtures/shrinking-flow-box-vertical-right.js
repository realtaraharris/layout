'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const ShrinkingFlowBox = require('../../src/components/shrinking-flow-box');

module.exports = ({x, y, width, height}) => {
  const marginA = 100;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      Margin,
      {
        top: marginA,
        bottom: marginA,
        left: marginA,
        right: marginA,
        showBoxes: true
      },
      c(
        ShrinkingFlowBox,
        {mode: 'vertical', align: 'right'},
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 100,
          sizeMode: 'capHeight',
          text: 'i',
          showBoxes: false
        }),
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 100,
          sizeMode: 'capHeight',
          text: 'Wide',
          showBoxes: false
        }),
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 100,
          sizeMode: 'capHeight',
          text: '|',
          showBoxes: false
        })
      )
    )
  );
};
