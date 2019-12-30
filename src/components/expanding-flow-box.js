'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class ExpandingFlowBox extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(renderContext, {mode, expand}, childBox, childCount, cache, parent) {
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
    if (children.length > 0) {
      console.log('children:', children.length);
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        console.log(child.instance.box);
        child.instance.box.x = _x;
        _x += child.instance.box.width;
      }
    }

    return [{}, {}];
  }

  render(renderContext, {color}) {
    renderContext.fillStyle = color;
    renderContext.fillRect(
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
