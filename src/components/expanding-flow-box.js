'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class ExpandingFlowBox extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
    this.shrinkChildCount = 0;
    this.shrinkChildrenWidth = 0;
    this.shrinkChildrenHeight = 0;
  }

  size(props, {mode, parent, children, childPosition}) {
    if (mode !== 'expand') {
      return;
    }

    const newBox = Object.assign({}, parent.instance.childBoxes[childPosition]);
    this.box = newBox;

    for (let child of children) {
      if (child.instance.flowMode() === 'shrink') {
        const width = child.instance.box.width || 0;
        const height = child.instance.box.height || 0;

        const childFlowModeProp = props.mode;

        if (childFlowModeProp === 'horizontal') {
          this.shrinkChildrenWidth += width;
        } else if (childFlowModeProp === 'vertical') {
          this.shrinkChildrenHeight += height;
        }
        this.shrinkChildCount++;
      }
    }

    for (let i = 0; i < children.length; i++) {
      let width = 0;
      let height = 0;
      const child = children[i];

      let denomHeight = 1;
      let denomWidth = 1;

      if (props.mode === 'vertical') {
        denomHeight = children.length - this.shrinkChildCount;
        denomWidth = 1;
      } else if (props.mode === 'horizontal') {
        denomHeight = 1;
        denomWidth = children.length - this.shrinkChildCount;
      }

      const newHeight =
        (this.box.height - this.shrinkChildrenHeight) / denomHeight;
      const newWidth = (this.box.width - this.shrinkChildrenWidth) / denomWidth;

      if (child.instance.flowMode() === 'shrink') {
        width = child.instance.box.width;
        height = child.instance.box.height;
      } else {
        width = newWidth;
        height = newHeight;
      }

      this.childBoxes.push({
        x: 0,
        y: 0,
        width,
        height
      });
    }
  }

  position(props, {parent, childPosition}) {
    const parentBox = parent.instance.childBoxes[childPosition];

    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    let _x = parentBox.x;
    let _y = parentBox.y;

    for (let childBox of this.childBoxes) {
      childBox.y = _y;
      childBox.x = _x;
      if (props.mode === 'horizontal') {
        _x += childBox.width;
      } else if (props.mode === 'vertical') {
        _y += childBox.height;
      }
    }
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
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
  expand: PropTypes.oneOf(['vertical', 'horizontal', 'bidirectional'])
};
module.exports = ExpandingFlowBox;
