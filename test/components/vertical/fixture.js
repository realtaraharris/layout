'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const ShrinkingFlowBox = require('../../../src/components/shrinking-flow-box');
const Button = require('../../../src/components/button');
const log = require('../../../src/log');

module.exports = ({x, y, width, height}) => {
  const marginA = 0;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      ShrinkingFlowBox,
      {mode: 'vertical', align: 'center'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false,
        done: () => {}
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false,
        done: () => {}
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false,
        done: () => {}
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 20,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false,
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
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 100,
            sizeMode: 'capHeight',
            text: 'A',
            showBoxes: false,
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
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 200,
            sizeMode: 'capHeight',
            text: 'B',
            showBoxes: false
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
            font: 'SourceSerifPro-Regular',
            color: 'white',
            size: 30,
            sizeMode: 'capHeight',
            text: 'C',
            showBoxes: false
          })
        )
      )
    )
  );
};
