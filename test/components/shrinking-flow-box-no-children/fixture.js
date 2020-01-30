'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const FlowBox = require('../../../src/components/flow-box');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      FlowBox,
      {sizing: 'shrink', mode: 'horizontal', align: 'left'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 90,
        text: 'Push Me',
        sizeMode: 'capHeight',
        showBoxes: false
      }),
      c(FlowBox, {sizing: 'shrink', mode: 'vertical', align: 'right'})
    )
  );
};
