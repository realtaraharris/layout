'use strict'

const comparator = (a, b) => (a > b ? 1 : (a < b ? -1 : 0))

// swiped from https://stackoverflow.com/a/33697671
function insertSorted (array, item) {
  let min = 0
  let max = array.length

  // get the index we need to insert the item at
  let index = Math.floor((min + max) / 2)
  while (max > min) {
    if (comparator(item, array[index]) < 0) {
      max = index
    } else {
      min = index + 1
    }
    index = Math.floor((min + max) / 2)
  }

  // check for duplicate items behind and ahead of insertion point
  /*
  const ahead = (index < (max - 1)) && array[index + 1]
  const behind = (index > 0) && array[index - 1]
  if (item === ahead || item === behind) {
    return
  }
  */

  // insert the item
  array.splice(index, 0, item)
}

const EPSILON = 0.000001
function intersect (lineA, lineB) {
  const [ x1, y1, x2, y2 ] = lineA
  const [ x3, y3, x4, y4 ] = lineB

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // if denominator is zero, lineA and lineB are parallel
  if (Math.abs(denominator) < EPSILON) {
    return
  }

  const uA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
  const uB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

  const uAd = uA / denominator
  const uBd = uB / denominator

  const intersectionX = x1 + uAd * (x2 - x1)
  const intersectionY = y1 + uAd * (y2 - y1)

  // coincident line case
  if (Math.abs(uAd) < EPSILON && Math.abs(uBd) < EPSILON && Math.abs(denominator) < EPSILON) {
    return
  }

  if ((uAd >= 0) && (uAd <= 1) && (uBd >= 0) && (uBd <= 1)) {
    return [ intersectionX, intersectionY ]
  }
}

/**
 * ugh, this is O(n^2), but you'll cache the result, right?
 */
function rasterizePolygon (lineLoop, [ aabbX, aabbY, aabbWidth, aabbHeight ], lineHeight) {
  const lineCount = aabbHeight / lineHeight
  let result = new Array(lineCount)
  for (let h = 0; h < lineCount; h++) {
    result[h] = {
      intervals: [],
      box: { y: 0, height: 0 }
    }
  }

  for (let i = 0; i < lineLoop.length; i++) {
    const lineA = lineLoop[i]

    let thisLineHeight = 0
    for (let j = 0; j < lineCount; j++) { // TODO: compute this from the bounding box
      const textLine = [
        -1,
        thisLineHeight,
        aabbWidth + 1,
        thisLineHeight
      ]
      const nextLine = [
        -1,
        thisLineHeight + lineHeight,
        aabbWidth + 1,
        thisLineHeight + lineHeight
      ]

      // record the common dimensions for the entire row once
      if (i === 0) {
        result[j].box.y = aabbY + thisLineHeight
        result[j].box.height = lineHeight
      }

      // TODO: modify intersect() to save a few ops
      // because we're calling it in a loop, we should compute the
      // slope once, and send that in over and over again
      const intersection = intersect(lineA, textLine)
      const nextLineIntersection = intersect(lineA, nextLine)

      if (intersection && nextLineIntersection) {
        const currentX = intersection[0]
        const nextX = nextLineIntersection[0]

        const insertX = (lineA[0] - lineA[2] > 0)
          ? nextX
          : currentX

        insertSorted(result[j].intervals, insertX + aabbX)
      }

      thisLineHeight += lineHeight
    }
  }

  return result
}

function checkPoint ([ x, y ], [ boxX, boxY, boxWidth, boxHeight ]) {
  return x >= boxX && y >= boxY && x <= boxX + boxWidth && y <= boxY + boxHeight
}

function intersectAabb (boxA, [ xB, yB, widthB, heightB ]) {
  return (
    checkPoint([ xB, yB ], boxA) ||
    checkPoint([ xB + widthB, yB ], boxA) ||
    checkPoint([ xB, yB + heightB ], boxA) ||
    checkPoint([ xB + widthB, yB + heightB ], boxA)
  )
}

/**
 *
 * @param {*} rasterA - 2D array of boxes
 * @param {*} bbA - bounding box
 * @param {*} rasterB - 2D array of boxes
 * @param {*} bbB - bounding box
 */
function mergeRasterizations (rasterA, bbA, rasterB, bbB) {
  // if the bounding boxes don't even overlap, quit
  if (!intersectAabb(bbA, bbB)) {
    return
  }

  let result = []

  // calculate y-offset
  const [ bbAX, bbAY ] = bbA // eslint-disable-line
  const [ bbBX, bbBY, bbBWidth, bbBHeight ] = bbB // eslint-disable-line
  const yOffsetTop = bbBY - bbAY

  const yOffsetBottom = bbBY + bbBHeight - bbAY // eslint-disable-line

  const lineHeight = 1
  let currentLineY = 0
  let i = 0
  for (let lineA of rasterA) {
    const lineB = rasterB[i]

    // pass lines through that are above and/or below second box
    if ((currentLineY < yOffsetTop) || (currentLineY >= yOffsetBottom)) {
      result.push(lineA)
    }

    if (lineB) {
      // actually merge the lines
      let mergedLine = lineA.intervals.slice(0).sort((a, b) => a - b)

      for (let x of lineB.intervals) {
        insertSorted(mergedLine, x)
      }

      result.push(Object.assign({}, lineB, { intervals: mergedLine }))
    }
    i++

    currentLineY += lineHeight
  }
  return result
}

module.exports = { rasterizePolygon, intersect, intersectAabb, mergeRasterizations }
