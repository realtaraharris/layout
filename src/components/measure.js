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
        // console.log(
        //   `before: groupId: ${props.groupId}, measurementId: ${props.measurementId}, x: ${accumulatedVector.x}, y: ${accumulatedVector.y}`
        // );

        if (props.measurementId === 1) {
          accumulatedVector.x += this.box.x;
          accumulatedVector.y += this.box.y;
        } else {
          accumulatedVector.x -= this.box.x;
          accumulatedVector.y -= this.box.y;
        }

        // console.log(
        //   `after: groupId: ${props.groupId}, measurementId: ${props.measurementId}, x: ${accumulatedVector.x}, y: ${accumulatedVector.y}`
        // );
      }
    );
  }

  render({width, height, showBoxes}, {renderContext}) {
    // if (showBoxes) {
    renderContext.strokeStyle = 'green';
    // renderContext.strokeRect(this.box.x, this.box.y, width, height);
    // renderContext.fillStyle = 'lightgray';
    // renderContext.fillRect(this.box.x, this.box.y, width, height);

    renderContext.beginPath();
    circle(renderContext, this.box.x, this.box.y, 3);
    renderContext.stroke();
    // }
  }
}

module.exports = Measure;
