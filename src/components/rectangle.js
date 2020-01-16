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
      console.log(
        'Rectangle, down. parent.instance.childBoxes:',
        parent.instance.childBoxes,
        'name:',
        parent.instance.constructor.name,
        'depth:',
        depth
      );

      this.box = Object.assign({}, parent.instance.childBoxes[childPosition]);
      console.log('THIS.BOX:', {
        box: this.box,
        childPosition
      });
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

    console.log(
      'childPosition:',
      childPosition,
      'parent.instance.childBoxes[childPosition]:',
      parent.instance.childBoxes[childPosition]
    );
    this.box.x = parent.instance.childBoxes[childPosition].x;
    this.box.y = parent.instance.childBoxes[childPosition].y;
    // this.box.x = updatedParentPosition.x;
    // this.box.y = updatedParentPosition.y;

    // TODO: this should not accept multiple children!
    // return [updatedParentPosition];
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

  flowMode() {
    return 'expand';
  }
}

module.exports = Rectangle;
