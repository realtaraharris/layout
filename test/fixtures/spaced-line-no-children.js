'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const SpacedLine = require('../../src/components/spaced-line');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'horizontal', align: 'left'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 90,
        text: 'Push Me',
        sizeMode: 'capHeight',
        showBoxes: false
      }),
      c(SpacedLine, {mode: 'vertical', align: 'right'})
    )
  );
};
