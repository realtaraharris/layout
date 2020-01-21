'use strict';

const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const ExpandingFlowBox = require('../../src/components/expanding-flow-box');
const ShrinkingFlowBox = require('../../src/components/shrinking-flow-box');
const Rectangle = require('../../src/components/rectangle');

module.exports = ({x, y, width, height}) => {
  const showBoxes = true;
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      ExpandingFlowBox,
      {
        mode: 'horizontal',
        align: 'left',
        expand: 'bidirectional',
        showBoxes,
        color: 'red'
      },
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          expand: 'bidirectional',
          showBoxes,
          color: 'blue'
        },
        c(
          ShrinkingFlowBox,
          {mode: 'vertical', align: 'left', color: 'green', showBoxes},
          c(
            Margin,
            {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'First Heading',
              showBoxes
            })
          )
        ),
        c(Rectangle, {
          color: '#FFDD00',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        }),
        c(Label, {
          font: 'SourceSerifPro-Regular',
          color: 'black',
          size: 30,
          sizeMode: 'capHeight',
          text: 'Down Here',
          showBoxes
        })
      ),
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          expand: 'bidirectional',
          showBoxes,
          color: 'blue'
        },
        c(
          ShrinkingFlowBox,
          {mode: 'vertical', align: 'left', color: 'red', showBoxes},
          c(
            Margin,
            {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'Second Heading',
              showBoxes
            })
          )
        ),
        c(Rectangle, {
          color: 'orange',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        })
      ),
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          expand: 'bidirectional',
          showBoxes,
          color: 'blue'
        },
        c(
          ShrinkingFlowBox,
          {mode: 'vertical', align: 'left', color: 'red', showBoxes},
          c(
            Margin,
            {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'Third Heading',
              showBoxes
            })
          )
        ),
        c(Rectangle, {
          color: 'red',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        })
      )
    )
  );
};
