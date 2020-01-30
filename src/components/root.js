'use strict';

const Component = require('../component');
const PropTypes = require('introspective-prop-types');

class Root extends Component {
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

  size() {
    // no need to do anything here because the root node has no parent
  }

  position({align, width, height}) {
    if (align === 'center') {
      this.box.x = width / 2 - this.box.width / 2;
      this.box.y = height / 2 - this.box.height / 2;
    }
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
