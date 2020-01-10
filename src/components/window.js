'use strict';

const Layout = require('../components');

class Window extends Layout {
  constructor(props) {
    super(props);
  }

  // TODO: add check to ensure labels have NO children
  // sends a child box up
  size() {
    return {x: 0, y: 0, width: 0, height: 0};
  }

  position({x, y}) {
    this.box.x = x;
    this.box.y = y;

    return [{x: this.box.x, y: this.box.y, width: 0, height: 0}];
  }

  render({width, height, showBoxes}, {renderContext}) {
    if (showBoxes) {
      renderContext.strokeStyle = 'gray';
      renderContext.strokeRect(this.box.x, this.box.y, width, height);
      renderContext.fillStyle = 'lightgray';
      renderContext.fillRect(this.box.x, this.box.y, width, height);
    }
  }
}

module.exports = Window;
