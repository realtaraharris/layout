'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class Margin extends Layout {
  size({top, right, bottom, left}, {childBox, mode}) {
    if (mode === 'shrink') {
      this.box = Object.assign({}, childBox);
    }

    return {
      x: this.box.x,
      y: this.box.y,
      width: this.box.width + left + right,
      height: this.box.height + top + bottom
    };
  }

  position({top, left}, {updatedParentPosition, childCount}) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    return Array(childCount).fill(
      Object.assign(
        {},
        {
          x: updatedParentPosition.x + left,
          y: updatedParentPosition.y + top
        }
      )
    );
  }

  render({top, bottom, left, right, showBoxes = false}, {renderContext}) {
    if (!showBoxes) {
      return;
    }

    renderContext.setLineDash([4, 4]);
    renderContext.strokeStyle = 'darkgray';
    renderContext.strokeRect(
      this.box.x + left,
      this.box.y + top,
      this.box.width,
      this.box.height
    );

    renderContext.setLineDash([]);
    renderContext.strokeStyle = 'orange';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width + right + left,
      this.box.height + top + bottom
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
