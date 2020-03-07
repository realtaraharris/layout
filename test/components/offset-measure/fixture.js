'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');

const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const FlowBox = require('../../../src/components/flow-box');
const Offset = require('../../../src/components/offset');
const Measure = require('../../../src/components/measure');
const Rectangle = require('../../../src/components/rectangle');
const Window = require('../../../src/components/window');

const popupMenu = ({key, value, options, selectPropOption}) => {
  return c(
    Offset,
    {
      groupId: 'popupMenu0',
      measurementId: 2,
      layer: 'tooltip'
    },
    c(
      FlowBox,
      {
        sizingHorizontal: 'shrink',
        sizingVertical: 'shrink',
        alignHorizontal: 'left',
        alignVertical: 'top',
        stackChildren: 'vertical'
      },
      c(Measure, {groupId: 'popupMenu0', measurementId: 1, showBoxes: true}),
      c(
        Rectangle,
        {
          sizingHorizontal: 'shrink',
          sizingVertical: 'shrink',
          color: 'rgba(128, 128, 128, 0.75)',
          topLeft: 3,
          topRight: 3,
          bottomLeft: 3,
          bottomRight: 3
        },
        c(
          Margin,
          {
            sizingHorizontal: 'shrink',
            sizingVertical: 'shrink',
            top: 10,
            bottom: 5,
            left: 10,
            right: 10
          },
          c(
            FlowBox,
            {
              sizingHorizontal: 'shrink',
              sizingVertical: 'shrink',
              alignHorizontal: 'left',
              alignVertical: 'center',
              stackChildren: 'vertical'
            },
            options.map(option =>
              c(
                Margin,
                {
                  sizingHorizontal: 'shrink',
                  sizingVertical: 'shrink',
                  top: 0,
                  bottom: 10,
                  left: 0,
                  right: 0
                },
                c(
                  FlowBox,
                  {
                    sizingHorizontal: 'shrink',
                    sizingVertical: 'shrink',
                    alignHorizontal: 'left',
                    alignVertical: 'top',
                    stackChildren: 'vertical'
                  },
                  option === value &&
                    c(Measure, {
                      groupId: 'popupMenu0',
                      measurementId: 0,
                      showBoxes: true
                    }),
                  c(Label, {
                    font: 'SourceSansPro-Regular',
                    color: 'black',
                    size: 20,
                    text: option,
                    sizeMode: 'capHeight',
                    showBoxes: false,
                    onClick: () => selectPropOption(key, option)
                  })
                )
              )
            )
          )
        )
      )
    )
  );
};

module.exports = ({x, y, width, height}) => {
  const key = '';
  const value = 'baz';
  const options = ['foo', 'bar', 'baz'];
  return c(
    Root,
    {x, y, width, height, color: 'black', layers: ['window', 'tooltip']},
    c(
      Window,
      {x: 100, y: 150, width: 200, height: 200, showBoxes: true},
      c(
        Margin,
        {top: 20, left: 20, right: 20, bottom: 20},
        c(
          FlowBox,
          {
            sizingHorizontal: 'expand',
            sizingVertical: 'expand',
            alignVertical: 'top',
            alignHorizontal: 'left',
            stackChildren: 'vertical'
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
              font: 'SourceSansPro-Regular',
              color: 'black',
              size: 20,
              sizeMode: 'capHeight',
              text: 'selection: ',
              showBoxes: false
            }),
            popupMenu({key, value, options}),
            c(Label, {
              font: 'SourceSansPro-Regular',
              color: 'green',
              size: 20,
              sizeMode: 'capHeight',
              text: value,
              showBoxes: false
            })
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
              color: 'black',
              size: 20,
              sizeMode: 'capHeight',
              text: 'selection: ',
              showBoxes: false
            }),
            // popupMenu({key, value: 'bar', options}),
            c(Label, {
              font: 'SourceSansPro-Regular',
              color: 'green',
              size: 20,
              sizeMode: 'capHeight',
              text: 'oof',
              showBoxes: false
            })
          )
        )
      )
    )
  );
};
