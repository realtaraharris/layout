'use strict';

// TODO! MOST OF THIS CODE NEEDS TO GET RIPPED OUT. it's just a quick copy-paste to validate an idea

const Layout = require('../components');
const log = require('../log');
const PropTypes = require('introspective-prop-types');

class Document extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size({mode}, {childBox, childCount}) {
    if (childCount === 0) {
      return {x: 0, y: 0, width: 0, height: 0};
    }

    this.childBoxes.push(childBox);

    // if we have all the child boxes, process!
    if (this.childBoxes.length === childCount) {
      // go through each child and assign a final { x, y } coord pair
      let _w = 0;
      let _h = 0;

      let tallest = 0;
      let widest = 0;
      for (let box of this.childBoxes) {
        box.x = _w;
        box.y = _h;

        switch (mode) {
          case 'vertical':
            _h += box.height;

            if (box.width > widest) {
              widest = box.width;
              _w = box.width; // set the width to the _last_ box's width
            }
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
            log('invalid layout mode in spacedLine:', mode);
        }
      }

      return {x: 0, y: 0, width: _w, height: _h}; // send a size up to the parent
    }

    return false; // stops the traversal here
  }

  // eslint-disable-next-line no-unused-vars
  position({mode, align}, {updatedParentPosition}) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // calculate the box we'll be in because we don't have this info in
    // this.box when this function is run - maybe later we can use that instead?
    const biggestBox = this.childBoxes.reduce(
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

    let positionedChildren = [];
    let _y = updatedParentPosition.y; // eslint-disable-line

    // go through each child and assign a final { x, y } coord pair
    for (let box of this.childBoxes) {
      let _x = updatedParentPosition.x; // eslint-disable-line

      if (mode === 'horizontal') {
        switch (align) {
          case 'left':
            _x += box.x;
            break;
          case 'center':
            _x += box.x;
            _y =
              updatedParentPosition.y + biggestBox.height / 2 - box.height / 2;
            break;
          case 'right':
            _x += box.x;
            _y = updatedParentPosition.y + biggestBox.height - box.height;
            break;
          default:
            log('invalid alignment mode in spacedLine:', align);
            break;
        }
      } else if (mode === 'vertical') {
        switch (align) {
          case 'left':
            break;
          case 'center':
            _x += biggestBox.width / 2 - box.width / 2;
            break;
          case 'right':
            _x += biggestBox.width - box.width;
            break;
          default:
            log('invalid alignment mode in spacedLine:', align);
            break;
        }
      } else if (mode === 'diagonal') {
        _x += box.x;
      } else {
        log('invalid layout mode in spacedLine:', mode);
      }

      positionedChildren.push({x: 0, y: 0});

      switch (mode) {
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
          log('invalid layout mode in spacedLine:', mode);
          break;
      }
    }

    return positionedChildren;
  }

  render() {}
}
Document.propTypes = {
  mode: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']).isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired
};
module.exports = Document;
