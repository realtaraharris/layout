'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const SpacedLine = require('../../src/components/spaced-line');
const Button = require('../../src/components/button');

module.exports = ({onButtonClick, onLabelClick}) => ({x, y, width, height}) => {
  const marginA = 20;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'vertical', align: 'center'},
      c(Label, {
        font: 'sans',
        color: 'white',
        size: 90,
        text: 'Push Me',
        showBoxes: true,
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
            font: 'sans',
            size: 100,
            text: 'A',
            showBoxes: true,
            color: 'white',
            onClick: onLabelClick
          })
        )
      )
    )
  );
};
