'use strict';

const Component = require('../component');
const {roundRect} = require('../draw');

class Rectangle extends Component {
  size(props, {sizing, parentBox, component}) {
    const shrinkVertical =
      sizing === 'shrink' && props.sizingVertical === 'shrink';
    const shrinkHorizontal =
      sizing === 'shrink' && props.sizingHorizontal === 'shrink';
    const expandVertical =
      sizing === 'expand' && props.sizingVertical === 'expand';
    const expandHorizontal =
      sizing === 'expand' && props.sizingHorizontal === 'expand';

    if (expandVertical) {
      this.box.y = parentBox.y;
      this.box.height = parentBox.height;
    }

    if (expandHorizontal) {
      this.box.x = parentBox.x;
      this.box.width = parentBox.width;
    }

    // TODO: this needs an added shrink mode thing!
    const {children} = component;

    if (shrinkVertical) {
      let height = 0;
      for (let child of children) {
        const {box} = child.instance;
        height += box.height;
      }
      this.box.height = height;
    }

    if (shrinkHorizontal) {
      let width = 0;
      for (let child of children) {
        const {box} = child.instance;
        width += box.width;
      }
      this.box.width = width;
    }
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    for (let childBox of this.childBoxes) {
      childBox.x += parentBox.x;
      childBox.y += parentBox.y;
    }
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
