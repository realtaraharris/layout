'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const FlowBox = require('../../../src/components/flow-box');
const Label = require('../../../src/components/label');
const Context = require('../../../src/components/context');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      FlowBox,
      {
        sizingHorizontal: 'shrink',
        sizingVertical: 'shrink',
        alignVertical: 'top',
        alignHorizontal: 'left',
        stackChildren: 'vertical'
      },
      c(
        Context,
        {
          font: 'SourceSansPro-Regular',
          color: 'red',
          size: 100,
          sizeMode: 'capHeight',
          showBoxes: false
        },
        c(
          FlowBox,
          {
            sizingHorizontal: 'shrink',
            sizingVertical: 'shrink',
            alignVertical: 'top',
            alignHorizontal: 'left',
            stackChildren: 'horizontal'
          },
          c(Label, {
            text: 'i'
          }),
          c(Label, {
            text: 'x'
          })
        )
      ),
      c(
        Context,
        {
          font: 'SourceSansPro-Regular',
          color: 'blue',
          size: 100,
          sizeMode: 'capHeight',
          showBoxes: false
        },
        c(
          FlowBox,
          {
            sizingHorizontal: 'shrink',
            sizingVertical: 'shrink',
            alignVertical: 'top',
            alignHorizontal: 'left',
            stackChildren: 'horizontal'
          },
          c(Label, {
            text: 'x'
          }),
          c(Label, {
            text: 'i'
          })
        )
      ),
      c(
        FlowBox,
        {
          sizingHorizontal: 'shrink',
          sizingVertical: 'shrink',
          alignVertical: 'top',
          alignHorizontal: 'left',
          stackChildren: 'horizontal'
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'green',
          size: 100,
          sizeMode: 'capHeight',
          showBoxes: false,
          text: 'x'
        }),
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'green',
          size: 100,
          sizeMode: 'capHeight',
          showBoxes: false,
          text: 'z'
        })
      )
    )
  );
};
