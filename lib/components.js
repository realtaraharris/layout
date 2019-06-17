'use strict'

const log = require('./log')

class Root {
  constructor () {
    this.box = { x: 0, y: 0, width: 0, height: 0 }
  }

  size (renderContext, { x, y, width, height }, childBox) {
    this.box.width = childBox.width
    this.box.height = childBox.height

    // no need to return anything here because the root node has no parent
  }

  position (renderContext, { x, y, width, height }, updatedParentPosition, childCount) {
    this.box.x = updatedParentPosition.x
    this.box.y = updatedParentPosition.y

    let positionsForChildren = []
    for (let i = 0; i < childCount; i++) {
      positionsForChildren.push(Object.assign({}, updatedParentPosition))
    }

    return positionsForChildren
  }

  render (renderContext, { x, y, width, height }) {
    renderContext.fillStyle = 'black'
    renderContext.fillRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    )
  }
}

class Label { // TODO: add check to ensure labels have NO children
  constructor () {
    this.box = { x: 0, y: 0, width: 0, height: 0 }
  }

  // sends a child box up
  size (renderContext, { text, size, font }) {
    renderContext.font = `${size}px ${font}`
    const textMetrics = renderContext.measureText(text)
    const newBox = {
      x: 0,
      y: 0,
      width: textMetrics.width,
      height: textMetrics.emHeightAscent
    }
    this.box = newBox

    return Object.assign({}, newBox)
  }

  position (renderContext, { x, y, width, height }, updatedParentPosition) {
    this.box.x = updatedParentPosition.x
    this.box.y = updatedParentPosition.y

    // return value ignored in leaf nodes such as these
    // TODO: add assertions that ths component has no children!
    // we want to give users an error if they're doing that!
  }

  render (renderContext, { text, size, font }) {
    renderContext.fillStyle = 'white'
    renderContext.font = `${size}px ${font}`
    renderContext.fillText(text, this.box.x, this.box.y + this.box.height)
  }
}

class Margin {
  constructor () {
    this.box = { x: 0, y: 0, width: 0, height: 0 }
  }

  size (renderContext, { top, right, bottom, left }, childBox) {
    this.box = Object.assign({}, childBox)

    return {
      x: this.box.x,
      y: this.box.y,
      width: this.box.width + left + right,
      height: this.box.height + top + bottom
    }
  }

  position (renderContext, { top, right, bottom, left }, updatedParentPosition, childCount) {
    this.box.x = updatedParentPosition.x
    this.box.y = updatedParentPosition.y

    let positionsForChildren = []
    for (let i = 0; i < childCount; i++) {
      positionsForChildren.push(Object.assign({}, {
        x: updatedParentPosition.x + left,
        y: updatedParentPosition.y + top
      }))
    }

    return positionsForChildren
  }

  render (renderContext, { top, bottom, left, right }) {
    renderContext.setLineDash([4, 4])
    renderContext.strokeStyle = 'darkgray'
    renderContext.strokeRect(
      this.box.x + left,
      this.box.y + top,
      this.box.width + right - left,
      this.box.height + bottom - top
    )
    
    renderContext.setLineDash([])
    renderContext.strokeStyle = 'orange'
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width + right + left,
      this.box.height + top + bottom
    )
  }
}

class SpacedLine {
  constructor () {
    this.box = { x: 0, y: 0, width: 0, height: 0 }
    this.childBoxes = []
  }

  size (renderContext, { mode }, childBox, childCount) {
    this.childBoxes.push(childBox)

    // if we have all the child boxes, process!
    if (this.childBoxes.length === childCount) {
      // go through each child and assign a final { x, y } coord pair
      let _w = 0
      let _h = 0

      let tallest = 0
      let widest = 0
      for (let box of this.childBoxes) {
        box.x = _w
        box.y = _h

        switch (mode) {
          case 'vertical':
            _h += box.height

            if (box.width > widest) {
              widest = box.width
              _w = box.width // set the width to the _last_ box's width
            }
            break
          case 'horizontal':
            if (box.height > tallest) {
              tallest = box.height
              _h = box.height // set the height to the _last_ box's height
            }
            _w += box.width
            break
          case 'diagonal':
            _w += box.width
            _h += box.height
            break
          default:
            log('invalid layout mode in spacedLine:', mode)
        }
      }

      return { x: 0, y: 0, width: _w, height: _h } // send a size up to the parent
    }

    return false // stops the traversal here
  }

  position (renderContext, { mode, align }, updatedParentPosition, childCount) {
    this.box.x = updatedParentPosition.x
    this.box.y = updatedParentPosition.y

    // calculate the box we'll be in because we don't have this info in
    // this.box when this function is run - maybe later we can use that instead?
    const finalBox = this.childBoxes.reduce((accum, curr) => {
      if (curr.height > accum.height) {
        accum.height = curr.height
      }

      if (curr.width > accum.width) {
        accum.width = curr.width
      }

      return accum
    }, { width: 0, height: 0 })

    let positionedChildren = []
    let _y = updatedParentPosition.y
    for (let box of this.childBoxes) {
      // go through each child and assign a final { x, y } coord pair
      let _x = updatedParentPosition.x

      if (mode === 'horizontal') {
        switch (align) {
          case 'left':
            _x += box.x
            break
          case 'center':
            _x += box.x
            _y = (finalBox.height / 2) - (box.height / 2)
            break
          case 'right':
            _x += box.x
            _y = finalBox.height - box.height
            break
          default:
            log('invalid alignment mode in spacedLine:', align)
        }
      } else if (mode === 'vertical') {
        switch (align) {
          case 'left':
            break
          case 'center':
            _x = (finalBox.width / 2) - (box.width / 2)
            break
          case 'right':
            _x += finalBox.width - (box.width)
            break
          default:
            log('invalid alignment mode in spacedLine:', align)
        }
      } else if (mode === 'diagonal') {
        _x = box.x
      }

      positionedChildren.push({ x: _x, y: _y })

      switch (mode) {
        case 'vertical':
          _y += box.height
          break
        case 'horizontal':
          _x += box.width
          break
        case 'diagonal':
          _x += box.width
          _y += box.height
          break
        default:
          log('invalid layout mode in spacedLine:', mode)
      }
    }

    return positionedChildren
  }

  render (renderContext, {}) {
  }
}

class Button {
  constructor () {
    this.box = { x: 0, y: 0, width: 0, height: 0 }
  }

  size (renderContext, { x, y, width, height }, childBox) {
    // this.box = Object.assign({}, childBox)
    return childBox // sends a child box up
  }

  position (renderContext, { x, y, width, height }, updatedParentPosition) {
    this.box.x = updatedParentPosition.x
    this.box.y = updatedParentPosition.y

    return [updatedParentPosition]
  }

  render (renderContext, { x, y, width, height }) {
  }
}

module.exports = {
  Root, Label, Margin, SpacedLine, Button //, Offset, Grid, Checkbox
}

/**
 * given an existing line + offset vector, returns an offset line
 */
// class Offset {
//   size () {}
//   position () {}
//   render: () {}
// }

/**
 * supplies a list of line segments + a way of finding intersections
 */
// class Grid {
//   size () {}
//   position () {}
//   render: () {}
// }
