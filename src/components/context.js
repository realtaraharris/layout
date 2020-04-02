'use strict';

const Component = require('../component');

class Context extends Component {
  size(props, {component}) {
    const childBox = component.children[0].instance.box;
    this.box = childBox;
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
    for (let childBox of this.childBoxes) {
      childBox.x += parentBox.x;
      childBox.y += parentBox.y;
    }
  }

  render() {}
}

module.exports = Context;
