'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class Root extends Layout {
  constructor(props) {
    super(props);
    this.box.x = props.x;
    this.box.y = props.y;
    this.box.width = props.width;
    this.box.height = props.height;
    this.childBoxes = [
      {x: props.x, y: props.y, width: props.width, height: props.height}
    ];
  }

  size({x, y, width, height}, {depth}) {
    console.log('Root, down.', 'depth:', depth, {x, y, width, height});
    // this.box.x = props.x;
    // this.box.y = props.y;
    // this.box.width = props.width;
    // this.box.height = props.height;
    // if (!isNaN(childBox.width)) {
    //   this.box.width = childBox.width;
    // }
    // if (!isNaN(childBox.height)) {
    //   this.box.height = childBox.height;
    // }
    // console.log('setting this.box to:', this.box);
    // no need to return anything here because the root node has no parent
  }

  position({align, width, height}, {updatedParentPosition, childCount}) {
    if (align === 'center') {
      this.box.x = width / 2 - this.box.width / 2;
      this.box.y = height / 2 - this.box.height / 2;
    } else {
      this.box.x = updatedParentPosition.x;
      this.box.y = updatedParentPosition.y;
    }

    return Array(childCount).fill(Object.assign({}, this.box));
  }

  render({color}, {renderContext}) {
    renderContext.fillStyle = color;
    renderContext.fillRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }

  intersect() {
    return {
      hit: false,
      descend: true
    };
  }
}

Root.propTypes = {
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
  layers: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  showBoxes: PropTypes.bool.isRequired
};

module.exports = Root;
