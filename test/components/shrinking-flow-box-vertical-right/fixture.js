'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const FlowBox = require('../../../src/components/flow-box');

module.exports = ({x, y, width, height}) => {
  const marginA = 100;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      Margin,
      {
        sizingHorizontal: 'shrink',
        sizingVertical: 'shrink',
        top: marginA,
        bottom: marginA,
        left: marginA,
        right: marginA,
        showBoxes: true
      },
      c(
        FlowBox,
        {
          sizingHorizontal: 'shrink',
          sizingVertical: 'shrink',
          alignVertical: 'top',
          alignHorizontal: 'right',
          stackChildren: 'vertical'
        },
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
