'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const FlowBox = require('../../../src/components/flow-box');
const Window = require('../../../src/components/window');
const Viewport = require('../../../src/components/viewport');

module.exports = ({firstLabelEventHandler, secondLabelEventHandler}) => ({
  x,
  y,
  width,
  height
}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      Window,
      {
        x: 100,
        y: 20,
        width: 300,
        height: 100,
        showBoxes: true
      },
      c(
        FlowBox,
        {sizing: 'shrink', mode: 'horizontal', align: 'center'},
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'white',
          size: 20,
          sizeMode: 'capHeight',
          text: 'nope',
          showBoxes: false,
          onMouseMove: firstLabelEventHandler
        }),
        c(
          Margin,
          {sizing: 'shrink', top: 10, bottom: 10, left: 10, right: 10},
          c(
            Viewport,
            {width: 200, height: 30, offsetX: 0, offsetY: 0},
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'white',
              size: 30,
              sizeMode: 'capHeight',
              text: 'mouseover-target',
              showBoxes: false,
              onMouseMove: secondLabelEventHandler
            })
          )
        )
      )
    )
  );
};
