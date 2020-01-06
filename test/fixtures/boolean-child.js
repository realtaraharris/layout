'use strict';

const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const FlowBox = require('../../src/components/shrinking-flow-box');

module.exports = ({x, y, width, height}) => {
  const showChild = false;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      FlowBox,
      {mode: 'horizontal', align: 'center'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'You can see this',
        showBoxes: false
      }),
      showChild &&
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 20,
          sizeMode: 'capHeight',
          text: `but if you see this, that's a paddlin'`,
          showBoxes: false
        })
    )
  );
};
