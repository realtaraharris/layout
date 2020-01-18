'use strict';

const Layout = require('../components');
const {roundRect} = require('../draw');

class Rectangle extends Layout {
  constructor() {
    super();
    this.box = {x: 0, y: 0, width: 20, height: 20};
  }
  size(props, {childBox, mode, parent, childPosition, depth}) {
    // this.box = Object.assign({}, childBox);
    if (mode === 'down') {
      this.box = Object.assign({}, parent.instance.childBoxes[childPosition]);
      // return {
      //   x: this.box.x,
      //   y: this.box.y,
      //   width: this.box.width,
      //   height: parent.instance.box.height
      // };
    }
  }

  position(
    props,
    {updatedParentPosition, childCount, mode, parent, childPosition}
  ) {
    // if (mode === 'down') {
    //   this.box.width = parent.instance.box.width;
    // }

    this.box.x = parent.instance.childBoxes[childPosition].x;
    this.box.y = parent.instance.childBoxes[childPosition].y;
    // this.box.x = updatedParentPosition.x;
    // this.box.y = updatedParentPosition.y;

    // TODO: this should not accept multiple children!
    // return [updatedParentPosition];
  }

  render({color, topLeft, topRight, bottomLeft, bottomRight}, {renderContext}) {
    renderContext.fillStyle = color;
    roundRect(
      renderContext,
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height,
      {
        topLeft,
        topRight,
        bottomLeft,
        bottomRight
      }
    );
    renderContext.fill();
  }

  flowMode() {
    return 'expand';
  }
}

module.exports = Rectangle;
