'use strict';

const log = require('./log');

function sizeShrinkVertical(props, children) {
  let _h = 0;
  let tallest = 0;
  let childHeights = [];
  let dependents = [];

  for (let child of children) {
    const {box} = child.instance;
    if (props.stackChildren === 'vertical') {
      dependents.push(child);
      _h += box.height;
    } else if (props.stackChildren === 'horizontal' && box.height > tallest) {
      dependents = [child];
      tallest = box.height;
      _h = box.height; // set the height to the _last_ box's height
    } else if (props.stackChildren === 'diagonal') {
      dependents.push(child);
      _h += box.height;
    }
    childHeights.push(box.height);
  }

  return {height: _h, childHeights, dependents};
}

function sizeShrinkHorizontal(props, children) {
  let _w = 0;
  let widest = 0;
  let childWidths = [];
  let dependents = [];

  for (let child of children) {
    const {box} = child.instance;
    if (props.stackChildren === 'vertical' && box.width > widest) {
      dependents = [child];
      widest = box.width;
      _w = box.width; // set the width to the _last_ box's width
    } else if (props.stackChildren === 'horizontal') {
      dependents.push(child);
      _w += box.width;
    } else if (props.stackChildren === 'diagonal') {
      dependents.push(child);
      _w += box.width;
    }
    childWidths.push(box.width);
  }

  return {width: _w, childWidths, dependents};
}

function positionShrinkVertical(props, parentBox, childBoxes) {
  const biggestBox = getTallestBox(childBoxes);

  let _y = parentBox.y;

  return childBoxes.map(box => {
    if (props.stackChildren === 'horizontal') {
      switch (props.alignVertical) {
        case 'top':
          break;
        case 'center':
          _y = parentBox.y + biggestBox.height / 2 - box.height / 2;
          break;
        case 'bottom':
          _y = parentBox.y + biggestBox.height - box.height;
          break;
        default:
          log(
            'invalid props.alignVertical in positionShrinkVertical:',
            props.align
          );
          break;
      }
    }

    const y = _y;

    switch (props.stackChildren) {
      case 'vertical':
        _y += box.height;
        break;
      case 'horizontal':
        // do not add any height here
        break;
      case 'diagonal':
        _y += box.height;
        break;
      default:
        log(
          'invalid props.stackChildren in positionShrinkVertical:',
          props.stackChildren
        );
        break;
    }

    return {y, height: box.height};
  });
}

function positionShrinkHorizontal(props, parentBox, childBoxes) {
  const biggestBox = getWidestBox(childBoxes);
  let _x = parentBox.x;

  return childBoxes.map(box => {
    if (props.stackChildren === 'vertical') {
      switch (props.alignHorizontal) {
        case 'left':
          break;
        case 'center':
          _x = parentBox.x + biggestBox.width / 2 - box.width / 2;
          break;
        case 'right':
          _x = parentBox.x + biggestBox.width - box.width;
          break;
        default:
          log(
            'invalid props.alignHorizontal in positionShrinkHorizontal:',
            props.alignHorizontal
          );
          break;
      }
    } else if (props.stackChildren === 'horizontal') {
      _x += box.x;
    } else if (props.stackChildren === 'diagonal') {
      _x += box.x;
    } else {
      log(
        'invalid props.stackChildren in positionShrinkHorizontal:',
        props.stackChildren
      );
    }

    const x = _x;

    switch (props.stackChildren) {
      case 'horizontal':
        _x += box.width;
        break;
      case 'diagonal':
        _x += box.width;
        break;
    }

    return {x, width: box.width};
  });
}

function sizeExpandingVertical(props, children, box) {
  let shrinkChildCount = 0;
  let shrinkChildrenHeight = 0;
  let dependents = [];

  for (let child of children) {
    if (child.instance.sizingVertical() !== 'shrink') {
      continue;
    }

    if (props.stackChildren === 'vertical') {
      dependents.push(child);
      shrinkChildrenHeight += child.instance.box.height;
    }
    shrinkChildCount++;
  }

  let childHeights = [];
  for (let child of children) {
    let height = 0;
    if (child.instance.sizingVertical() === 'shrink') {
      const childBox = child.instance.box;
      height = childBox.height;
    } else {
      const denomHeight =
        props.stackChildren === 'vertical'
          ? children.length - shrinkChildCount
          : 1;
      height = (box.height - shrinkChildrenHeight) / denomHeight;
    }

    dependents.push(child);
    childHeights.push(height);
  }

  return {childHeights, dependents};
}

function sizeExpandingHorizontal(props, children, box) {
  let shrinkChildCount = 0;
  let shrinkChildrenWidth = 0;
  let dependents = [];

  for (let child of children) {
    if (child.instance.sizingHorizontal() !== 'shrink') {
      continue;
    }

    if (props.stackChildren === 'horizontal') {
      dependents.push(child);
      shrinkChildrenWidth += child.instance.box.width;
    }
    shrinkChildCount++;
  }

  let childWidths = [];
  for (let child of children) {
    let width = 0;
    if (child.instance.sizingHorizontal() === 'shrink') {
      const childBox = child.instance.box;
      width = childBox.width;
    } else {
      const denomWidth =
        props.stackChildren === 'horizontal'
          ? children.length - shrinkChildCount
          : 1;
      width = (box.width - shrinkChildrenWidth) / denomWidth;
    }

    dependents.push(child);
    childWidths.push(width);
  }

  return {childWidths, dependents};
}

function getTallestBox(childBoxes) {
  return childBoxes.reduce(
    (accum, curr) => {
      if (curr.height > accum.height) {
        accum.height = curr.height;
      }

      return accum;
    },
    {height: 0}
  );
}

function getWidestBox(childBoxes) {
  return childBoxes.reduce(
    (accum, curr) => {
      if (curr.width > accum.width) {
        accum.width = curr.width;
      }

      return accum;
    },
    {width: 0}
  );
}

function positionExpandingVertical(props, parentBox, childBoxes) {
  // if we only have a single child, center it using our own box
  const tallestBox =
    childBoxes.length > 1 ? getTallestBox(childBoxes) : parentBox;
  let y = parentBox.y;

  return childBoxes.map(childBox => {
    if (props.alignVertical === 'top') {
      y = parentBox.y;
    } else if (props.alignVertical === 'center') {
      y = parentBox.y + (tallestBox.height - childBox.height) / 2;
    } else if (props.alignVertical === 'bottom') {
      y = parentBox.y + parentBox.height - childBox.height;
    } else {
      log(`bad prop - props.alignVertical: ${props.alignVertical}`);
    }

    return {
      y,
      height: childBox.height
    };
  });
}

function positionExpandingHorizontal(props, parentBox, childBoxes) {
  // if we only have a single child, center it using our own box
  const widestBox =
    childBoxes.length > 1 ? getWidestBox(childBoxes) : parentBox;

  return childBoxes.map(childBox => {
    let x;
    if (props.alignHorizontal === 'left') {
      x = parentBox.x;
    } else if (props.alignHorizontal === 'center') {
      x = parentBox.x + (widestBox.width - childBox.width) / 2;
    } else if (props.alignHorizontal === 'right') {
      x = parentBox.x + parentBox.width - childBox.width;
    } else {
      log(`bad prop - props.alignHorizontal: ${props.alignHorizontal}`);
    }

    return {
      x,
      width: childBox.width
    };
  });
}

module.exports = {
  sizeShrinkVertical,
  sizeShrinkHorizontal,
  positionShrinkVertical,
  positionShrinkHorizontal,
  sizeExpandingVertical,
  sizeExpandingHorizontal,
  positionExpandingVertical,
  positionExpandingHorizontal
};
