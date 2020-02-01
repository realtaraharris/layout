'use strict';

const Component = require('../component');
const {roundRect} = require('../draw');

class Rectangle extends Component {
  size(props, {sizing, parentBox}) {
    if (sizing === 'expand') {
      this.box.x = parentBox.x;
      this.box.y = parentBox.y;
      this.box.width = parentBox.width;
      this.box.height = parentBox.height;
    }
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
  }

  render(
    {color, topLeft = 0, topRight = 0, bottomLeft = 0, bottomRight = 0},
    {renderContext}
  ) {
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

  sizingVertical() {
    return 'expand';
  }

  sizingHorizontal() {
    return 'expand';
  }
}

module.exports = Rectangle;
