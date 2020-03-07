'use strict';

const Component = require('../component');

class Window extends Component {
  size() {
    this.box = {x: 0, y: 0, width: 0, height: 0};
    this.childBoxes = [{x: 0, y: 0, width: 0, height: 0}];
  }

  position({x, y}, {positionDeps, component, positionRetries}) {
    if (positionRetries > 0) {
      return;
    }

    this.box.x = x;
    this.box.y = y;

    for (let childBox of this.childBoxes) {
      childBox.x += x;
      childBox.y += y;
    }

    positionDeps.addNode(component.name, component);

    const {children} = component;
    for (let child of children) {
      positionDeps.addNodeAndDependency(child, component.name);
    }
  }

  render({width, height, showBoxes}, {renderContext}) {
    if (showBoxes) {
      renderContext.strokeStyle = 'gray';
      renderContext.strokeRect(this.box.x, this.box.y, width, height);
      renderContext.fillStyle = 'lightgray';
      renderContext.fillRect(this.box.x, this.box.y, width, height);
    }
  }
}

module.exports = Window;
