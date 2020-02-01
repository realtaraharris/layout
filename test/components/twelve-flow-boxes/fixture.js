'use strict';

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const FlowBox = require('../../../src/components/flow-box');
const Label = require('../../../src/components/label');
const Rectangle = require('../../../src/components/rectangle');

function generateFlowBox(
  sizingHorizontal,
  sizingVertical,
  alignVertical,
  alignHorizontal,
  stackChildren
) {
  return c(
    FlowBox,
    {
      sizingHorizontal,
      sizingVertical,
      alignVertical,
      alignHorizontal,
      stackChildren,
      color: 'rgba(255, 0, 0, 0.01)',
      showBoxes: true
    },
    c(Label, {
      font: 'SourceSansPro-Regular',
      color: 'black',
      size: 25,
      sizeMode: 'xHeight',
      text: 'first',
      showBoxes: false
    }),
    c(Rectangle, {
      color: 'rgba(255, 203, 5, 0.1)',
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
      showBoxes: true
    }),
    c(Label, {
      font: 'SourceSansPro-Regular',
      color: 'black',
      size: 50,
      sizeMode: 'xHeight',
      text: 'last',
      showBoxes: false
    })
  );
}

module.exports = ({x, y, width, height}) => {
  const verticalContainerProps = {
    sizingHorizontal: 'expand',
    sizingVertical: 'expand',
    alignVertical: 'center',
    alignHorizontal: 'center',
    stackChildren: 'vertical',
    color: 'rgba(255, 0, 0, 0.01)',
    showBoxes: true
  };

  const horizontalContainerProps = {
    sizingHorizontal: 'expand',
    sizingVertical: 'expand',
    alignVertical: 'center',
    alignHorizontal: 'center',
    stackChildren: 'vertical',
    color: 'rgba(0, 0, 255, 0.01)',
    showBoxes: true
  };

  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      FlowBox,
      {
        sizingHorizontal: 'expand',
        sizingVertical: 'expand',
        alignVertical: 'center',
        alignHorizontal: 'center',
        stackChildren: 'horizontal',
        color: 'rgba(0, 255, 0, 0.01)',
        showBoxes: false
      },
      c(
        FlowBox,
        verticalContainerProps,
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'expand', 'top', 'left', 'vertical')
        ),
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'expand', 'top', 'center', 'vertical')
        ),
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'expand', 'top', 'right', 'vertical')
        )
      ),
      c(
        FlowBox,
        verticalContainerProps,
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'expand', 'top', 'left', 'horizontal')
        ),
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'expand', 'center', 'left', 'horizontal')
        ),
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'expand', 'bottom', 'left', 'horizontal')
        )
      ),
      c(
        FlowBox,
        verticalContainerProps,
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('shrink', 'expand', 'top', 'left', 'horizontal')
        ),
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('shrink', 'expand', 'center', 'left', 'horizontal')
        ),
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('shrink', 'expand', 'bottom', 'left', 'horizontal')
        )
      ),
      c(
        FlowBox,
        verticalContainerProps,
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'shrink', 'top', 'left', 'horizontal')
        ),
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'shrink', 'center', 'left', 'horizontal')
        ),
        c(
          FlowBox,
          horizontalContainerProps,
          generateFlowBox('expand', 'shrink', 'bottom', 'left', 'horizontal')
        )
      )
    )
  );
};
