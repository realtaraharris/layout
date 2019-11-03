'use strict';

const Layout = require('../components');
const {shallowCompare} = require('../layout');
const {modes} = require('../layout');

class Viewport extends Layout {
  serialize() {
    return {
      box: Object.assign({}, this.box),
      parentBox: Object.assign({}, this.parentBox),
      childBoxes: Object.assign({}, this.childBoxes),
      positionInfo: Object.assign({}, this.positionInfo)
    };
  }
  deserialize(state) {
    this.box = state.box;
    this.parentBox = state.parentBox;
    this.childBoxes = state.childBoxes;
    this.positionInfo = state.positionInfio;
  }

  getLayoutModes() {
    return {
      sizeMode: modes.SELF, // size depends entirely on self
      positionMode: modes.PARENTS // position depends entirely on parent
    };
  }

  constructor() {
    super();
    this.childBoxes = [];
  }

  size(renderContext, {width, height}, childBox) {
    this.childBoxes.push(childBox);

    this.box = Object.assign({}, {width, height});
    this.parentBox = Object.assign({}, {width, height});
    // return {width, height};
  }

  position(renderContext, {offsetX, offsetY}, updatedParentPosition) {
    // for (let i = 0; i < component.children.length; i++) {
    //   const child = component.children[i];
    //   const newPos = position[i];

    //   calcBoxPositions(renderContext, child, newPos);
    // }

    // console.log({
    //   'this.children': this.children,
    //   'this.parent': this.parent,
    //   'this.parent.methods.box.x': this.parent.methods.box.x,
    //   'this.parent.methods.box.y': this.parent.methods.box.y,
    //   'updatedParentPosition.x': updatedParentPosition.x,
    //   'updatedParentPosition.y': updatedParentPosition.y
    // });
    // console.trace();
    // this.box.x = this.parent.methods.box.x;
    this.box.x = updatedParentPosition.x;
    // this.box.y = this.parent.methods.box.y;
    this.box.y = updatedParentPosition.y;

    // TODO: this should only accept a SINGLE child, not an array!
    const absX = (this.box.width - this.childBoxes[0].width) * offsetX;
    const absY = (this.box.height - this.childBoxes[0].height) * offsetY;

    const result = [
      {
        x: this.box.x + absX,
        y: this.box.y + absY
      }
    ];

    this.positionInfo = result;
  }

  componentShouldUpdateSize(prevProps, nextProps) {
    // TODO: also check if changes in children are going to trigger an update?
    return prevProps.width !== nextProps.width;
  }

  componentShouldUpdatePosition(prevProps, nextProps) {
    return (
      prevProps.offsetX !== nextProps.offsetX ||
      prevProps.offsetY !== nextProps.offsetY
    );
  }

  componentShouldUpdateRender(prevProps, nextProps) {
    return true; // TODO: don't always trigger a re-render
  }

  render(renderContext) {
    renderContext.strokeStyle = 'teal';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );

    renderContext.beginPath();
    renderContext.rect(this.box.x, this.box.y, this.box.width, this.box.height);
    renderContext.clip();
  }

  intersect({clientX, clientY, deltaX, deltaY}, eventName) {
    const {box} = this;
    const childBox = this.childBoxes[0];
    const insideBox =
      clientX >= box.x &&
      clientX <= box.x + box.width &&
      clientY >= box.y &&
      clientY <= box.y + box.height;

    if (insideBox && eventName === 'click') {
      return {
        hit: false,
        descend: true
      };
    } else if (insideBox && eventName === 'scroll') {
      return {
        hit: true,
        descend: false,
        box,
        childBox,
        event: {clientX, clientY, deltaX, deltaY}
      };
    }
    return {
      hit: false,
      descend: false
    };
  }

  invalidate(nextProps) {
    return shallowCompare(nextProps, this.props); // TODO: copy the props into this.props somehow
  }
}

module.exports = Viewport;
