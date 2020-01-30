'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

function sizeExpanding(props, children, box) {
  let shrinkChildCount = 0;
  let shrinkChildrenWidth = 0;
  let shrinkChildrenHeight = 0;

  for (let child of children) {
    if (child.instance.flowMode() !== 'shrink') {
      continue;
    }

    if (props.mode === 'horizontal') {
      shrinkChildrenWidth += child.instance.box.width;
    } else if (props.mode === 'vertical') {
      shrinkChildrenHeight += child.instance.box.height;
    }
    shrinkChildCount++;
  }

  let childBoxes = [];
  for (let child of children) {
    let width = 0;
    let height = 0;
    if (child.instance.flowMode() === 'shrink') {
      const childBox = child.instance.box;
      width = childBox.width;
      height = childBox.height;
    } else {
      const denomHeight =
        props.mode === 'vertical' ? children.length - shrinkChildCount : 1;
      const denomWidth =
        props.mode === 'horizontal' ? children.length - shrinkChildCount : 1;
      width = (box.width - shrinkChildrenWidth) / denomWidth;
      height = (box.height - shrinkChildrenHeight) / denomHeight;
    }

    childBoxes.push({
      x: 0,
      y: 0,
      width,
      height
    });
  }

  return childBoxes;
}

function positionExpanding(props, parentBox, childBoxes) {
  let box = {
    x: parentBox.x,
    y: parentBox.y
  };

  if (props.align === 'center') {
    const biggestBox = childBoxes.reduce(
      (accum, curr) => {
        if (curr.height > accum.height) {
          accum.height = curr.height;
        }

        if (curr.width > accum.width) {
          accum.width = curr.width;
        }

        return accum;
      },
      {width: 0, height: 0}
    );

    box.x += (parentBox.width - biggestBox.width) / 2;
    box.y += (parentBox.height - biggestBox.height) / 2;
    box.width = biggestBox.width;
    box.height = biggestBox.height;
  }

  let _x = box.x;
  let _y = box.y;

  return {
    box,
    childBoxes: childBoxes.map(childBox => {
      const x = _x;
      const y = _y;
      if (props.mode === 'horizontal') {
        _x += childBox.width;
      } else if (props.mode === 'vertical') {
        _y += childBox.height;
      }

      return {
        x,
        y,
        width: childBox.width,
        height: childBox.height
      };
    })
  };
}

class ExpandingFlowBox extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(props, {mode, parent, children, childPosition}) {
    if (mode !== 'expand') {
      return;
    }

    const childBox = parent.instance.childBoxes[childPosition];
    this.box.x = childBox.x;
    this.box.y = childBox.y;
    this.box.width = childBox.width;
    this.box.height = childBox.height;
    this.childBoxes = sizeExpanding(props, children, this.box);
  }

  position(props, {parent, childPosition}) {
    const childBox = parent.instance.childBoxes[childPosition];
    const {box, childBoxes} = positionExpanding(
      props,
      childBox,
      this.childBoxes
    );

    this.box.x = box.x;
    this.box.y = box.y;
    this.box.width = box.width || this.box.width;
    this.box.height = box.height || this.box.height;
    this.childBoxes = childBoxes;
  }

  render({color, showBoxes}, {renderContext}) {
    if (!showBoxes) {
      return;
    }

    for (let childBox of this.childBoxes) {
      renderContext.strokeStyle = 'green';
      renderContext.strokeRect(
        childBox.x,
        childBox.y,
        childBox.width,
        childBox.height
      );
    }

    renderContext.strokeStyle = color;
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }

  flowMode() {
    return 'expand';
  }
}

ExpandingFlowBox.propTypes = {
  mode: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']).isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired
};
module.exports = ExpandingFlowBox;
