'use strict';

const Component = require('../component');
const {circle} = require('../draw');

class Measure extends Component {
  size() {
    this.box = {x: 0, y: 0, width: 0, height: 0};
    this.childBoxes = [{x: 0, y: 0, width: 0, height: 0}];
  }

  position(props, {parentBox, collectPositionDone}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    collectPositionDone(
      props.groupId,
      props.measurementId,
      accumulatedVector => {
        accumulatedVector.x += this.box.x;
        accumulatedVector.y += this.box.y;
      }
    );
  }

  render({showBoxes}, {renderContext}) {
    if (showBoxes) {
      renderContext.strokeStyle = 'green';
      renderContext.beginPath();
      circle(renderContext, this.box.x, this.box.y, 3);
      renderContext.stroke();
    }
  }
}

module.exports = Measure;
