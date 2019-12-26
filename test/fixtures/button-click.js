'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const FlowBox = require('../../src/components/flow-box');
const Button = require('../../src/components/button');

module.exports = ({onButtonClick, onLabelClick}) => ({x, y, width, height}) => {
  const marginA = 20;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      FlowBox,
      {mode: 'vertical', align: 'center'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 90,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false,
        onClick: onLabelClick
      }),
      c(
        Button,
        {width: 200, height: 40, onClick: onButtonClick},
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
            size: 100,
            sizeMode: 'capHeight',
            text: 'A',
            showBoxes: false,
            color: 'white',
            onClick: onLabelClick
          })
        )
      )
    )
  );
};
