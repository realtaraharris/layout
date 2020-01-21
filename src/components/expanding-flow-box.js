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

    // console.log({depth, newBox});

    let _x = 0;
    let _y = 0;

    if (mode === 'expand') {
      for (let child of children) {
        const {name} = child.instance.constructor;
        // if (name === 'ShrinkingFlowBox' || name === 'Label') {
        // console.log(
        //   'child.instance.flowMode():',
        //   child.instance.flowMode(),
        //   name
        // );

        if (child.instance.flowMode() === 'shrink') {
          const width = child.instance.box.width || 0;
          const height = child.instance.box.height || 0;
          // console.log(
          //   `                           ${width.toFixed(2)} ${height}`
          // );

          const childFlowModeProp = child.props.mode;
          // console.log({childFlowModeProp});
          if (childFlowModeProp === 'horizontal') {
            this.shrinkChildrenWidth += width;
          } else if (childFlowModeProp === 'vertical') {
            this.shrinkChildrenHeight += height;
          }
          this.shrinkChildCount++;
        }
      }

      // console.log('this.shrinkChildrenHeight:', this.shrinkChildrenHeight);
      // console.log('this.shrinkChildrenWidth:', this.shrinkChildrenWidth);
      // console.log('this.shrinkChildCount:', this.shrinkChildCount);
      // console.log('children.length:', children.length);

      for (let i = 0; i < children.length; i++) {
        let width = 0;
        let height = 0;
        const child = children[i];
        const {name} = child.instance.constructor;

        let denomHeight = 1;
        let denomWidth = 1;

        if (props.mode === 'vertical') {
          denomHeight = children.length - this.shrinkChildCount;
          denomWidth = 1;
        } else if (props.mode === 'horizontal') {
          denomHeight = 1;
          denomWidth = children.length - this.shrinkChildCount;
        }

        // console.log(
        //   'props.mode:',
        //   props.mode,
        //   'denomHeight:',
        //   denomHeight,
        //   'denomWidth:',
        //   denomWidth
        // );

        const newHeight =
          (this.box.height - this.shrinkChildrenHeight) / denomHeight;
        const newWidth =
          (this.box.width - this.shrinkChildrenWidth) / denomWidth;

        // console.log({
        //   'children.length': children.length,
        //   'this.shrinkChildCount': this.shrinkChildCount
        // });

        // console.log({newHeight, newWidth});

        if (child.instance.flowMode() === 'shrink') {
          if (props.mode === 'horizontal') {
            height = this.box.height;
            width = this.box.width / children.length;
          } else if (props.mode === 'vertical') {
            height = newHeight;
          } else {
            console.error(`invalid mode in ExpandingFlowBox: ${props.mode}`);
          }
        } else if (child.instance.flowMode() === 'expand') {
          width = newWidth;
          height = newHeight;
        }

        const newChildBox = {
          x: _x,
          y: _y,
          width,
          height
        };

        if (
          name === 'ExpandingFlowBox' ||
          name === 'Label' ||
          name === 'Rectangle'
        ) {
          this.childBoxes.push(newChildBox);
        } else {
          this.childBoxes.push(this.box);
        }

        if (child.instance.flowMode() === 'shrink') {
          if (props.mode === 'horizontal') {
            _x += newWidth;
            width = newWidth; // this.box.width / children.length;
          } else if (props.mode === 'vertical') {
            _y += newHeight;
            // height = newHeight;
          } else {
            console.error(`invalid mode in ExpandingFlowBox: ${props.mode}`);
          }
        }
      }
    } else if (parent.instance.childBoxes[childPosition]) {
      this.childBoxes = [
        Object.assign({}, parent.instance.childBoxes[childPosition])
      ];
    }
  }

  // NB: this code is fine, but it depends on layout.js calling this method breadth-first, and it is currently doing it depth-first!
  position(
    props,
    {updatedParentPosition, children, parent, childPosition, mode, depth}
  ) {
    const parentBox = parent.instance.childBoxes[childPosition];
    // if (props.mode === 'horizontal') {
    //   this.box.x += parentBox.x;
    //   console.log('this.box.x:', this.box.x);
    // } else if (props.mode === 'vertical') {
    //   this.box.y += parentBox.y;
    //   console.log('this.box.y:', this.box.y);
    // }

    console.log(
      '  SETTING this.box, before:',
      `x: ${this.box.x.toFixed(2)} y: ${this.box.y.toFixed(2)}`,
      depth
    );

    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    console.log(
      '  SETTING this.box, after:',
      `x: ${this.box.x.toFixed(2)} y: ${this.box.y.toFixed(2)}`,
      depth
    );

    let _x = parentBox.x;
    let _y = parentBox.y;

    for (let childBox of this.childBoxes) {
      if (props.mode === 'horizontal') {
        // this.box.x = _x;
        // _x += childBox.width;
        childBox.x += _x;
        _x += childBox.width;
      } else if (props.mode === 'vertical') {
        // this.box.y = _y;
        // _y += childBox.height;
        childBox.y += _y;
        _y += childBox.height;
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
