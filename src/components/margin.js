'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class Margin extends Layout {
  size(props, {children, sizing, parentBox}) {
    const {top, right, bottom, left} = props;
    if (sizing === 'shrink' && props.sizing === 'shrink') {
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

    if (sizing === 'expand' && props.sizing === 'expand') {
      this.box.x = parentBox.x;
      this.box.y = parentBox.y;
      this.box.width = parentBox.width;
      this.box.height = parentBox.height;

      this.childBoxes = [
        {
          x: this.box.x + left,
          y: this.box.y + top,
          width: this.box.width - left - right,
          height: this.box.height - top - bottom
        }
      ];
    }
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    if (props.sizing === 'shrink') {
      this.childBoxes[0].x = this.box.x + props.left;
      this.childBoxes[0].y = this.box.y + props.top;
    }
    if (props.sizing === 'expand') {
      this.childBoxes[0].x = this.box.x + props.left;
      this.childBoxes[0].y = this.box.y + props.top;
    }
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

  sizing() {
    return this.props.sizing;
  }
}

Margin.propTypes = {
  sizing: PropTypes.oneOf(['expand', 'shrink']).isRequired,
  left: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
  showBoxes: PropTypes.bool.isRequired
};

module.exports = Margin;
