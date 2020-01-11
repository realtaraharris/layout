'use strict';

const Layout = require('../components');
const {roundRect} = require('../draw');

class Rectangle extends Layout {
  size(props, {childBox, mode, parent}) {
    this.box = Object.assign({}, childBox);

    if (mode === 'down') {
      this.box.height = 400;
      // console.log('boop line 12', parent.instance.box.height);
      return {
        x: this.box.x,
        y: this.box.y,
        width: this.box.width,
        height: parent.instance.box.height
      };
    }

    return {
      x: this.box.x,
      y: this.box.y,
      width: this.box.width,
      height: this.box.height
    };
  }

  position(props, {updatedParentPosition, childCount, mode, parent}) {
    if (mode === 'up') {
      this.box.height = parent.instance.box.height;
      return {width: 0, height: 0};
    }
    if (mode === 'down') {
      // console.log('line 26:', parent.instance.box);
      this.box.width = parent.instance.box.width;
      // this.box.height = parent.instance.box.height;
    }

    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // TODO: this should not accept multiple children!
    return Array(childCount).fill(
      Object.assign(
        {},
        {
          x: updatedParentPosition.x,
          y: updatedParentPosition.y
        }
      )
    );
  }

  render({color, topLeft, topRight, bottomLeft, bottomRight}, {renderContext}) {
    renderContext.fillStyle = color;
    console.log('this.box, line 36:', this.box);
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
}

module.exports = Rectangle;
