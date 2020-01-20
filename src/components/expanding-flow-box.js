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

  size(props, {mode, parent, children, childPosition, depth}) {
    if (!parent || !parent.instance) {
      return;
    }
    const newBox = Object.assign({}, parent.instance.childBoxes[childPosition]);
    this.box = newBox;

    if (mode === 'expand') {
      let _x = 0;
      let _y = 0;

      for (let child of children) {
        const {name} = child.instance.constructor;
        // if (name === 'ShrinkingFlowBox' || name === 'Label') {
        console.log(
          'child.instance.flowMode():',
          child.instance.flowMode(),
          name
        );
        if (child.instance.flowMode() === 'shrink') {
          const {width, height} = child.instance.box;
          console.log(`                           ${width}${height}`);

          if (mode === 'horizontal') {
            this.shrinkChildrenWidth += width;
            this.shrinkChildCount++;
          } else if (mode == 'vertical') {
            this.shrinkChildrenHeight += height;
            this.shrinkChildCount++;
          }
        }
      }

      console.log('this.shrinkChildrenHeight:', this.shrinkChildrenHeight);
      console.log('this.shrinkChildrenWidth:', this.shrinkChildrenWidth);

      this.box.height -= this.shrinkChildrenHeight;
      this.box.width -= this.shrinkChildrenWidth;

      let width = 0;
      let height = 0;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const {name} = child.instance.constructor;

        const newHeight =
          this.box.height / //  - this.shrinkChildrenHeight) /
          (children.length - this.shrinkChildCount);
        const newWidth =
          this.box.width / // - this.shrinkChildrenWidth) /
          (children.length - this.shrinkChildCount);

        // if (name === 'Rectangle') {
        // if (child.instance.flowMode() === 'shrink') {
        if (props.mode === 'horizontal') {
          height = this.box.height;
          if (i > 0) {
            _x += newWidth;
            // _y += this.box.height;
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
  position(
    props,
    {updatedParentPosition, children, parent, childPosition, mode}
  ) {
    const parentBox = parent.instance.childBoxes[childPosition];
    if (props.mode === 'horizontal') {
      this.box.x += parentBox.x;
      console.log('this.box.x:', this.box.x);
    } else if (props.mode === 'vertical') {
      this.box.y += parentBox.y;
      console.log('this.box.y:', this.box.y);
    }

    // let _x = parentBox.x;
    // let _y = parentBox.y;

    // for (let childBox of this.childBoxes) {
    //   if (props.mode === 'horizontal') {
    //     this.box.x = _x;
    //     _x += childBox.width;
    //   } else if (props.mode === 'vertical') {
    //     this.box.y = _y;
    //     _y += childBox.height;
    //   }
    // }

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
