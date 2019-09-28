'use strict';
const {c} = require('../../src/layout');
const {Label, SpacedLine, Button, Margin} = require('../../src/components');
const {Root} = require('../../src/components/root');

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
