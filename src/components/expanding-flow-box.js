'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class ExpandingFlowBox extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(
    renderContext,
    {mode, expand},
    childBox,
    childCount,
    cache,
    parent,
    children
  ) {
    for (let child of children) {
      const {name} = child.instance.constructor;
    }

    const siblingCount = parent && parent.children.length;
    if (parent && parent.instance) {
      let width;
      if (siblingCount > 0) {
        width = parent.instance.box.width / siblingCount;
      }

      const newBox = Object.assign({}, parent.instance.box, {width});
      this.box = newBox;

      this.childBoxes.push(newBox);

      return newBox;
    }
  }

  // eslint-disable-next-line no-unused-vars
  position(
    renderContext,
    {mode, align, expand},
    updatedParentPosition,
    childCount,
    cache,
    children
  ) {
    let _x = 0;
    let _y = 0;

    let shrinkChildCount = 0;
    let shrinkChildrenWidth = 0;

    for (let child of children) {
      const {name} = child.instance.constructor;
      if (name === 'FlowBox') {
        shrinkChildCount++;
        const {width} = child.instance.box;
        shrinkChildrenWidth += width;
      }
    }

    const childBoxes = [];
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const {name} = child.instance.constructor;

        if (name === 'ExpandingFlowBox') {
          child.instance.box.width =
            (this.box.width - shrinkChildrenWidth) /
            (children.length - shrinkChildCount);
        }

        childBoxes.push({x: _x, y: _y});
        child.instance.box.x = _x;
        _x += child.instance.box.width;
      }
    }

    return childBoxes;
  }

  render(renderContext, {color, showBoxes}) {
    if (!showBoxes) {
      return;
    }
    renderContext.strokeStyle = color;
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }
}
ExpandingFlowBox.propTypes = {
  mode: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']).isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
  expand: PropTypes.oneOf(['vertical', 'horizontal', 'bidirectional'])
};
module.exports = ExpandingFlowBox;
