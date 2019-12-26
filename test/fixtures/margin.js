'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const FlowBox = require('../../src/components/flow-box');

module.exports = ({x, y, width, height}) => {
  const marginA = 10;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      FlowBox,
      {mode: 'horizontal', align: 'left'},
      c(
        Margin,
        {
          top: marginA,
          bottom: marginA,
          left: marginA,
          right: marginA,
          showBoxes: true
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 100,
          sizeMode: 'capHeight',
          text: 'A',
          showBoxes: false,
          done: () => {}
        })
      ),
      c(
        Margin,
        {
          top: marginA,
          bottom: marginA,
          left: marginA,
          right: marginA,
          showBoxes: true
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 100,
          sizeMode: 'capHeight',
          text: 'i',
          showBoxes: false,
          done: () => {}
        })
      )
    )
  );
};
