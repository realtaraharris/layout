'use strict';

const Layout = require('../components');
const log = require('../log');
const PropTypes = require('introspective-prop-types');

function sizeShrinking(props, children) {
  // go through each child and assign a final { x, y } coord pair
  let _w = 0;
  let _h = 0;
  let tallest = 0;
  let widest = 0;

  let childBoxes = [];
  for (let child of children) {
    const {box} = child.instance;

    switch (props.mode) {
      case 'vertical':
        if (box.width > widest) {
          widest = box.width;
          _w = box.width; // set the width to the _last_ box's width
        }
        _h += box.height;
        break;
      case 'horizontal':
        if (box.height > tallest) {
          tallest = box.height;
          _h = box.height; // set the height to the _last_ box's height
        }
        _w += box.width;
        break;
      case 'diagonal':
        _w += box.width;
        _h += box.height;
        break;
      default:
        log('invalid layout mode in spacedLine:', props.mode);
    }
    childBoxes.push({
      x: 0,
      y: 0,
      width: box.width,
      height: box.height
    });
  }

  return {box: {x: 0, y: 0, width: _w, height: _h}, childBoxes};
}

function positionShrinking(props, parentBox, childBoxes) {
  const biggestBox = childBoxes.reduce(
    (accum, curr) => {
      if (curr.height > accum.height) {
        accum.height = curr.height;
      }

      if (curr.width > accum.width) {
        accum.width = curr.width;
      }

      return accum;
    },
    {width: 0, height: 0}
  );

  let _y = parentBox.y;
  let _x = parentBox.x;

  return childBoxes.map(box => {
    if (props.mode === 'horizontal') {
      switch (props.align) {
        case 'left':
          break;
        case 'center':
          _y = parentBox.y + biggestBox.height / 2 - box.height / 2;
          break;
        case 'right':
          _y = parentBox.y + biggestBox.height - box.height;
          break;
        default:
          log('invalid alignment props.mode in spacedLine:', props.align);
          break;
      }
    } else if (props.mode === 'vertical') {
      switch (props.align) {
        case 'left':
          break;
        case 'center':
          _x = parentBox.x + biggestBox.width / 2 - box.width / 2;
          break;
        case 'right':
          _x = parentBox.x + biggestBox.width - box.width;
          break;
        default:
          log('invalid alignment props.mode in spacedLine:', props.align);
          break;
      }
    } else if (props.mode === 'diagonal') {
      _x += box.x;
    } else {
      log('invalid layout props.mode in spacedLine:', props.mode);
    }

    const x = _x;
    const y = _y;

    switch (props.mode) {
      case 'vertical':
        _y += box.height;
        break;
      case 'horizontal':
        _x += box.width;
        break;
      case 'diagonal':
        _x += box.width;
        _y += box.height;
        break;
      default:
        log('invalid layout props.mode in spacedLine:', props.mode);
        break;
    }

    return {x, y, width: box.width, height: box.height};
  });
}

function sizeExpanding(props, children, box) {
  let shrinkChildCount = 0;
  let shrinkChildrenWidth = 0;
  let shrinkChildrenHeight = 0;

  for (let child of children) {
    if (child.instance.sizing() !== 'shrink') {
      continue;
    }

    if (props.mode === 'horizontal') {
      shrinkChildrenWidth += child.instance.box.width;
    } else if (props.mode === 'vertical') {
      shrinkChildrenHeight += child.instance.box.height;
    }
    shrinkChildCount++;
  }

  let childBoxes = [];
  for (let child of children) {
    let width = 0;
    let height = 0;
    if (child.instance.sizing() === 'shrink') {
      const childBox = child.instance.box;
      width = childBox.width;
      height = childBox.height;
    } else {
      const denomHeight =
        props.mode === 'vertical' ? children.length - shrinkChildCount : 1;
      const denomWidth =
        props.mode === 'horizontal' ? children.length - shrinkChildCount : 1;
      width = (box.width - shrinkChildrenWidth) / denomWidth;
      height = (box.height - shrinkChildrenHeight) / denomHeight;
    }

    childBoxes.push({
      x: 0,
      y: 0,
      width,
      height
    });
  }

  return childBoxes;
}

function positionExpanding(props, parentBox, childBoxes) {
  let box = {
    x: parentBox.x,
    y: parentBox.y
  };

  if (props.align === 'center') {
    const biggestBox = childBoxes.reduce(
      (accum, curr) => {
        if (curr.height > accum.height) {
          accum.height = curr.height;
        }

        if (curr.width > accum.width) {
          accum.width = curr.width;
        }

        return accum;
      },
      {width: 0, height: 0}
    );

    box.x += (parentBox.width - biggestBox.width) / 2;
    box.y += (parentBox.height - biggestBox.height) / 2;
    box.width = biggestBox.width;
    box.height = biggestBox.height;
  }

  let _x = box.x;
  let _y = box.y;

  return {
    box,
    childBoxes: childBoxes.map(childBox => {
      const x = _x;
      const y = _y;
      if (props.mode === 'horizontal') {
        _x += childBox.width;
      } else if (props.mode === 'vertical') {
        _y += childBox.height;
      }

      return {
        x,
        y,
        width: childBox.width,
        height: childBox.height
      };
    })
  };
}

class FlowBox extends Layout {
  size(props, {sizing, children, parent, childPosition}) {
    if (sizing === 'shrink' && props.sizing === 'shrink') {
      const {box, childBoxes} = sizeShrinking(props, children);
      this.box = box;
      this.childBoxes = childBoxes;
    } else if (sizing === 'expand' && props.sizing === 'expand') {
      const childBox = parent.instance.childBoxes[childPosition];
      this.box.x = childBox.x;
      this.box.y = childBox.y;
      this.box.width = childBox.width;
      this.box.height = childBox.height;
      this.childBoxes = sizeExpanding(props, children, this.box);
    } else {
      // log('invalid props.sizing and/or sizing in FlowBox:', props.sizing, sizing);
    }
  }

  position(props, {parent, childPosition}) {
    const parentBox = parent.instance.childBoxes[childPosition];

    if (props.sizing === 'shrink') {
      this.box.x = parentBox.x;
      this.box.y = parentBox.y;
      this.childBoxes = positionShrinking(props, parentBox, this.childBoxes);
    } else if (props.sizing === 'expand') {
      const {box, childBoxes} = positionExpanding(
        props,
        parentBox,
        this.childBoxes
      );

      this.box.x = box.x;
      this.box.y = box.y;
      this.box.width = box.width || this.box.width;
      this.box.height = box.height || this.box.height;
      this.childBoxes = childBoxes;
    } else {
      log('invalid sizing mode in FlowBox:', props.sizing);
    }
  }

  render({color, showBoxes}, {renderContext}) {
    if (!showBoxes) {
      return;
    }

    for (let childBox of this.childBoxes) {
      renderContext.strokeStyle = 'green';
      renderContext.strokeRect(
        childBox.x,
        childBox.y,
        childBox.width,
        childBox.height
      );
    }

    renderContext.strokeStyle = color;
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }

  sizing() {
    return this.props.sizing;
  }
}

FlowBox.propTypes = {
  sizing: PropTypes.oneOf(['expand', 'shrink']).isRequired,
  mode: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']).isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired
};
module.exports = FlowBox;
