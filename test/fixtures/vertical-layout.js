'use strict';
const {c} = require('../../src/layout');
const {
  Root,
  Label,
  SpacedLine,
  Button,
  Margin
} = require('../../src/components');
const log = console.log;

module.exports = ({x, y, width, height}) => {
  const marginA = 0;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'vertical', align: 'center'},
      c(Label, {
        font: 'sans',
        color: 'white',
        size: 20,
        text: 'Push Me',
        showBoxes: true,
        done: () => {}
      }),
      c(Label, {
        font: 'sans',
        color: 'white',
        size: 20,
        text: 'Push Me',
        showBoxes: true,
        done: () => {}
      }),
      c(Label, {
        font: 'sans',
        color: 'white',
        size: 20,
        text: 'Push Me',
        showBoxes: true,
        done: () => {}
      }),
      c(Label, {
        font: 'sans',
        color: 'white',
        size: 20,
        text: 'Push Me',
        showBoxes: true,
        done: () => {}
      }),
      c(
        Button,
        {onInput: log, onClick: log},
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
            color: 'white',
            size: 100,
            text: 'A',
            showBoxes: true,
            done: () => {}
          })
        )
      ),
      c(
        Button,
        {onInput: log, onClick: log},
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'sans',
            color: 'white',
            size: 200,
            text: 'B',
            showBoxes: true
          })
        )
      ),
      c(
        Button,
        {onInput: log, onClick: log},
        c(
          Margin,
          {top: 0, bottom: 0, left: 0, right: 0, showBoxes: true},
          c(Label, {
            font: 'serif',
            color: 'white',
            size: 30,
            text: 'C',
            showBoxes: true
          })
        )
      )
    )
  );
};
