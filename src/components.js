'use strict';

class Layout {
  constructor() {
    this.box = {x: 0, y: 0, width: 0, height: 0};

    this.intersect = this.intersect.bind(this);
  }

  intersect(x, y) {
    const {box} = this;
    if (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      return {
        hit: true,
        descend: true
      };
    }
    return {
      hit: false,
      descend: true
    };
  }
}

class Button extends Layout {
  size(renderContext, props, childBox) {
    this.box.width = childBox.width;
    this.box.height = childBox.height;
    return childBox; // sends a child box up
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    return [updatedParentPosition];
  }

  render() {}

  intersect(x, y) {
    const {box} = this;
    if (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      return {
        hit: true,
        descend: false
      };
    }
    return {
      hit: false,
      descend: false
    };
  }
}

class Viewport extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(renderContext, {width, height}, childBox) {
    this.childBoxes.push(childBox);

    this.box = Object.assign({}, {width, height});
    return {width, height};
  }

  position(renderContext, {offsetX, offsetY}, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    const absX = (this.box.width - this.childBoxes[0].width) * offsetX;
    const absY = (this.box.height - this.childBoxes[0].height) * offsetY;

    const result = [
      {
        x: this.box.x + absX,
        y: this.box.y + absY
      }
    ];

    return result;
  }

  render(renderContext) {
    renderContext.strokeStyle = 'teal';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );

    renderContext.beginPath();
    renderContext.rect(this.box.x, this.box.y, this.box.width, this.box.height);
    renderContext.clip();
  }

  intersect(x, y) {
    const {box} = this;
    if (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      return {
        hit: false,
        descend: true
      };
    }
    return {
      hit: false,
      descend: false
    };
  }
}

module.exports = {
  Layout,
  Button,
  Viewport //, Offset, Grid, Checkbox
};

/**
 * given an existing line + offset vector, returns an offset line
 */
// class Offset extends Layout {
//   size () {}
//   position () {}
//   render: () {}
// }

/**
 * supplies a list of line segments + a way of finding intersections
 */
// class Grid extends Layout {
//   size () {}
//   position () {}
//   render: () {}
// }
