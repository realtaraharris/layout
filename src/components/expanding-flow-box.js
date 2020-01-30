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

  let newChildBoxes = [];
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

    newChildBoxes.push({
      x: 0,
      y: 0,
      width,
      height
    });
  }

  return newChildBoxes;
}

function positionExpanding(props, parentBox, box, childBoxes) {
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

    box.x = parentBox.x + (parentBox.width - biggestBox.width) / 2;
    box.y = parentBox.y + (parentBox.height - biggestBox.height) / 2;
    box.width = biggestBox.width;
    box.height = biggestBox.height;
  } else {
    box.x = parentBox.x;
    box.y = parentBox.y;
  }

  let _x = box.x;
  let _y = box.y;

  for (let childBox of childBoxes) {
    childBox.x = _x;
    childBox.y = _y;
    if (props.mode === 'horizontal') {
      _x += childBox.width;
    } else if (props.mode === 'vertical') {
      _y += childBox.height;
    }
  }
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

    this.box = Object.assign({}, parent.instance.childBoxes[childPosition]);

    this.childBoxes = sizeExpanding(props, children, this.box);
  }

  position(props, {parent, childPosition}) {
    const parentBox = parent.instance.childBoxes[childPosition];
    positionExpanding(props, parentBox, this.box, this.childBoxes);
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
