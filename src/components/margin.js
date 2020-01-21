'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class Margin extends Layout {
  size({top, right, bottom, left}, {children, mode}) {
    if (mode !== 'shrink') {
      return;
    }

    if (children.length > 1) {
      console.error('too many kids!');
    }
    const childBox = children[0].instance.box;

    this.box = {
      x: 0,
      y: 0,
      width: childBox.width + left + right,
      height: childBox.height + top + bottom
    };

    this.childBoxes = [
      {
        x: this.box.x + left,
        y: this.box.y + top,
        width: childBox.width,
        height: childBox.height
      }
    ];
  }

  position({top, left}, {parent, childPosition}) {
    const parentBox = parent.instance.childBoxes[childPosition];
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
    this.childBoxes[0].x = this.box.x + left;
    this.childBoxes[0].y = this.box.y + top;
  }

  render({showBoxes = false}, {renderContext}) {
    if (!showBoxes) {
      return;
    }

    renderContext.setLineDash([4, 4]);
    renderContext.strokeStyle = 'darkgray';
    renderContext.strokeRect(
      this.childBoxes[0].x, // + left,
      this.childBoxes[0].y, // + top,
      this.childBoxes[0].width,
      this.childBoxes[0].height
    );

    renderContext.setLineDash([]);
    renderContext.strokeStyle = 'orange';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width, // + right + left,
      this.box.height // + top + bottom
    );
  }
}

Margin.propTypes = {
  left: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
  showBoxes: PropTypes.bool.isRequired
};

module.exports = Margin;
