'use strict';

const Component = require('../component');
const {redo} = require('../util');

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

  position(
    props,
    {
      parentBox,
      component,
      positionDeps,
      collectPositionDone,
      positionRetries,
      redoList
    }
  ) {
    positionDeps.addNode(component.name, component);
    const {children} = component;
    for (let child of children) {
      positionDeps.addNodeAndDependency(child, component.name);
    }

    collectPositionDone(
      props.groupId,
      props.measurementId,
      accumulatedVector => {
        if (positionRetries === 0) {
          this.box.x = parentBox.x - accumulatedVector.x;
          this.box.y = parentBox.y - accumulatedVector.y;

          for (let childBox of this.childBoxes) {
            childBox.x = this.box.x;
            childBox.y = this.box.y;
          }
        }

        if (positionRetries === 0) {
          redoList.push(redo(component, positionDeps));
        }
      }
    );
  }

  render() {}
}

module.exports = Offset;
