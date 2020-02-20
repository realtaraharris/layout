'use strict';

const Component = require('../component');

class Offset extends Component {
  constructor(props) {
    super(props);
  }

  size() {
    this.box = {x: 0, y: 0, width: 0, height: 0};
    this.childBoxes = [
      {
        x: this.box.x,
        y: this.box.y,
        width: 0,
        height: 0
      }
    ];
  }

  position(props, {parentBox, collectPositionDone}) {
    this.box.x = parentBox.x + props.x;
    this.box.y = parentBox.y + props.y;

    for (let childBox of this.childBoxes) {
      childBox.x += this.box.x;
      childBox.y += this.box.y;
    }

    collectPositionDone(
      props.groupId,
      props.measurementId,
      accumulatedVector => {
        console.log(
          `before: groupId: ${props.groupId}, measurementId: ${props.measurementId}, x: ${this.box.x}, y: ${this.box.y}`
        );

        this.box.x = parentBox.x + accumulatedVector.x - 100;
        this.box.y = parentBox.y + accumulatedVector.y - 100;

        for (let childBox of this.childBoxes) {
          childBox.x = this.box.x + accumulatedVector.x;
          childBox.y = this.box.y + accumulatedVector.y;
        }

        console.log(
          `after: groupId: ${props.groupId}, measurementId: ${props.measurementId}, x: ${this.box.x}, y: ${this.box.y}`
        );
      }
    );
  }

  render() {}
}

module.exports = Offset;
