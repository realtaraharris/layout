'use strict';

const Component = require('../component');

class Button extends Component {
  size(props, {component, sizing}) {
    if (sizing !== 'shrink') {
      return;
    }

    const {children} = component;

    if (children.length > 1) {
      console.error('too many kids!');
    }
    const childBox = children[0].instance.box;

    this.box = {
      x: 0,
      y: 0,
      width: childBox.width,
      height: childBox.height
    };

    this.childBoxes = [
      {
        x: this.box.x,
        y: this.box.y,
        width: this.box.width,
        height: this.box.height
      }
    ];
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
    this.childBoxes[0].x = this.box.x;
    this.childBoxes[0].y = this.box.y;
  }

  render() {}

  intersect({clientX, clientY}) {
    const {box} = this;
    if (
      clientX >= box.x &&
      clientX <= box.x + box.width &&
      clientY >= box.y &&
      clientY <= box.y + box.height
    ) {
      return {
        hit: true,
        descend: false,
        box
      };
    }
    return {
      hit: false,
      descend: false
    };
  }
}

module.exports = Button;
