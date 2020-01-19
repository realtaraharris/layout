'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class ExpandingFlowBox extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(props, {mode, parent, children, childPosition, depth}) {
    if (!parent || !parent.instance) {
      return;
    }
    const newBox = Object.assign({}, parent.instance.childBoxes[childPosition]);
    this.box = newBox;

    if (mode === 'down') {
      let _x = 0;
      let _y = 0;

      let shrinkChildCount = 0;
      let shrinkChildrenWidth = 0;
      let shrinkChildrenHeight = 0;

      for (let child of children) {
        const {name} = child.instance.constructor;
        // if (name === 'ShrinkingFlowBox' || name === 'Label') {
        if (child.instance.flowMode() === 'shrink') {
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

      let width = 0;
      let height = 0;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const {name} = child.instance.constructor;

        const newHeight =
          (this.box.height - shrinkChildrenHeight) /
          (children.length - shrinkChildCount);
        const newWidth =
          (this.box.width - shrinkChildrenWidth) /
          (children.length - shrinkChildCount);

        // if (name === 'Rectangle') {
        // if (child.instance.flowMode() === 'shrink') {
        if (props.mode === 'horizontal') {
          width = newWidth;
          height = this.box.height;
          if (i > 0) {
            _x += newWidth;
            _y += this.box.height;
          }
        } else if (props.mode === 'vertical') {
          height = newHeight;
          if (i > 0) {
            _y += newHeight;
          }
        } else {
          console.error(`invalid mode in ExpandingFlowBox: ${props.mode}`);
        }

        const newChildBox = {
          x: _x,
          y: _y,
          width,
          height
        };

        if (name === 'ExpandingFlowBox') {
          this.childBoxes.push(newChildBox);
        } else {
          this.childBoxes.push(this.box);
        }
      }
    } else if (parent.instance.childBoxes[childPosition]) {
      this.childBoxes = [
        Object.assign({}, parent.instance.childBoxes[childPosition])
      ];
    }
  }

  // eslint-disable-next-line no-unused-vars
  position({mode}, {updatedParentPosition, children}) {
    let _x = 0;
    let _y = 0;
    for (let childBox of this.childBoxes) {
      if (mode === 'horizontal') {
        childBox.x = _x;
        // _x += childBox.width;
      }
      if (mode === 'vertical') {
        childBox.y = _y;
        // _y += childBox.height;
      }
    }

    return Object.assign([], this.childBoxes);
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
}

ExpandingFlowBox.propTypes = {
  mode: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']).isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
  expand: PropTypes.oneOf(['vertical', 'horizontal', 'bidirectional'])
};
module.exports = ExpandingFlowBox;
