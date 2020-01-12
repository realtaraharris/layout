'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class ExpandingFlowBox extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size({mode}, {parent}) {
    if (!parent || !parent.instance) {
      return;
    }

    console.log('MODE:', mode);

    const siblingCount = parent.children.length;
    const newBox = Object.assign({}, parent.instance.box);

    if (siblingCount > 0) {
      if (mode === 'horizontal') {
        newBox.width = parent.instance.box.width / siblingCount;
      }
      if (mode === 'vertical') {
        newBox.height = parent.instance.box.height / siblingCount;
      }
    }
    this.box = newBox;

    this.childBoxes.push(newBox);

    return newBox;
  }

  // eslint-disable-next-line no-unused-vars
  position({mode}, {updatedParentPosition, children}) {
    let _x = 0;
    let _y = 0;

    console.log('MODE:', mode);

    let shrinkChildCount = 0;
    let shrinkChildrenWidth = 0;
    let shrinkChildrenHeight = 0;

    for (let child of children) {
      const {name} = child.instance.constructor;
      if (name === 'ShrinkingFlowBox' || name === 'Label') {
        // if (child.instance.flowMode() === 'shrink') {
        const {width, height} = child.instance.box;

        if (mode === 'horizontal') {
          shrinkChildrenWidth += width;
          shrinkChildCount++;
        } else if (mode == 'vertical') {
          shrinkChildrenHeight += height;
          shrinkChildCount++;
        }
      }
    }

    const childBoxes = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const {name} = child.instance.constructor;

      const newHeight =
        (this.box.height - shrinkChildrenHeight) /
        (children.length - shrinkChildCount);
      const newWidth =
        (this.box.width - shrinkChildrenWidth) /
        (children.length - shrinkChildCount);

      if (name === 'ExpandingFlowBox') {
        // if (child.instance.flowMode() === 'shrink') {
        if (mode === 'horizontal') {
          child.instance.box.width = newWidth;
        } else {
          child.instance.box.height = newHeight;
        }

        if (mode === 'vertical') {
          child.instance.box.height = newHeight;
        } else {
          child.instance.box.height = this.box.height;
        }
      } else if (child.instance.flowMode() === 'expand') {
        if (mode === 'vertical') {
          child.instance.box.height = newHeight;
        }
      }

      childBoxes.push({
        x: _x + updatedParentPosition.x,
        y: _y + updatedParentPosition.y
      });

      if (mode === 'horizontal') {
        child.instance.box.x = _x;
      }

      if (mode === 'vertical') {
        child.instance.box.y = _y;
      }

      _x += mode === 'horizontal' ? child.instance.box.width : 0;
      _y += mode === 'vertical' ? child.instance.box.height : 0;
    }

    return childBoxes;
  }

  render({color, showBoxes}, {renderContext}) {
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
