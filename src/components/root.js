'use strict';

const Layout = require('../components');
const {modes} = require('../layout');

class Root extends Layout {
  serialize() {
    return {
      box: Object.assign({}, this.box),
      positionInfo: Object.assign({}, this.positionInfo)
    };
  }
  deserialize(state) {
    this.box = state.box;
    this.positionInfo = state.positionInfo;
  }

  getLayoutModes() {
    return {
      sizeMode: modes.PARENTS, // size depends entirely on parent (in this case props passed in!)
      positionMode: modes.PARENTS // position depends entirely on parent
    };
  }

  size(renderContext, props, childBox) {
    this.box.x = props.x;
    this.box.y = props.y;
    this.box.width = props.width;
    this.box.height = props.height;

    if (!isNaN(childBox.width)) {
      this.box.width = childBox.width;
    }
    if (!isNaN(childBox.height)) {
      this.box.height = childBox.height;
    }

    // no need to return anything here because the root node has no parent
    // this.parentBox = {
    //   x: props.x,
    //   y: props.y,
    //   width: props.width,
    //   height: props.height
    // };
  }

  position(
    renderContext,
    {align, width, height},
    updatedParentPosition,
    childCount
  ) {
    if (align === 'center') {
      this.box.x = width / 2 - this.box.width / 2;
      this.box.y = height / 2 - this.box.height / 2;
    } else {
      this.box.x = updatedParentPosition.x;
      this.box.y = updatedParentPosition.y;
    }

    this.positionInfo = Array(childCount).fill(Object.assign({}, this.box));
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

  intersect() {
    return {
      hit: false,
      descend: true
    };
  }
}

module.exports = Root;
